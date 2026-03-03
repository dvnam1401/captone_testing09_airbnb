// TC16: Đặt phòng thành công (end-to-end flow)
import { test, expect } from "@playwright/test";
import { RoomDetailPage } from "../pages/RoomDetailPage";
import { AuthHelper } from "../utils/authHelper";
import { readFileFromCSV } from "../utils/csvReader";
import { HomePage } from "../pages/HomePage";
import { RoomListPage } from "../pages/RoomListPage";

// Cập nhật interface data để có thêm cityName
interface BookingData {
  cityName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  expectedTotal: string;
}
const bookingData = readFileFromCSV<BookingData>("bookingData.csv");
const userData = readFileFromCSV<any>("userData.csv")[0];

test.describe("TC16 - Booking Success Flow", () => {
  test.beforeEach(async ({ page }) => {
    await AuthHelper.login(
      page,
      userData.email,
      userData.password,
      userData.fullName,
    );
  });
  for (const data of bookingData) {
    test(`Đặt phòng thành công: ${data.cityName} -> ${data.roomName}`, async ({
      page,
    }, testInfo) => {
      const homePage = new HomePage(page, testInfo);
      const roomListPage = new RoomListPage(page, testInfo);
      const roomDetailPage = new RoomDetailPage(page, testInfo);

      // 1. Chọn thành phố
      await homePage.selectLocation(data.cityName);

      // 2. Chon phòng
      await roomListPage.selectRoom(data.roomName);

      // 3. Chi tiết phòng (chọn ngày và khách)
      await roomDetailPage.selectDate(data.checkIn, data.checkOut);
      await roomDetailPage.setGuests(parseInt(data.guests));

      // 4. verify giá và đặt phòng
      const priceInfo = await roomDetailPage.getBookingCaculationInfo();
      console.log("Booking price info:", priceInfo);

      await roomDetailPage.clickBook();
      await roomDetailPage.confirmBookingSuccess();

      // 5. Xác nhận thành công
      await expect(roomDetailPage.successMessage).toBeVisible();
    });
  }
});
