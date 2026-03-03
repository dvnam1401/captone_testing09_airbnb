import test, { expect } from "@playwright/test";
import { readFileFromCSV } from "../utils/csvReader";
import { AuthHelper } from "../utils/authHelper";
import { HomePage } from "../pages/HomePage";
import { RoomDetailPage } from "../pages/RoomDetailPage";
import { RoomListPage } from "../pages/RoomListPage";

// TC17: Validate tính toán giá chính xác
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

test.describe("TC17 - Kiểm tra giá tiền khi chọn ngày và khách", () => {
  test.beforeEach(async ({ page }) => {
    await AuthHelper.login(
      page,
      userData.email,
      userData.password,
      userData.fullName,
    );
  });

  for (const data of bookingData) {
    test(`Giá đúng với phòng: ${data.roomName}`, async ({ page }, testInfo) => {
      const homePage = new HomePage(page, testInfo);
      const roomDetailPage = new RoomDetailPage(page, testInfo);
      const roomListPage = new RoomListPage(page, testInfo);

      await homePage.selectLocation(data.cityName);
      await roomListPage.selectRoom(data.roomName);

      await roomDetailPage.selectDate(data.checkIn, data.checkOut);
      await roomDetailPage.setGuests(parseInt(data.guests));

      const priceInfo = await roomDetailPage.getBookingCaculationInfo();
      console.log("Thông tin giá: ", priceInfo);

      await expect(priceInfo.displayedTotal).toEqual(
        Number(data.expectedTotal),
      );
    });
  }
});
