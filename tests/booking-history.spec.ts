import { test, expect } from "@playwright/test";
import { readFileFromCSV } from "../utils/csvReader";
import { AuthHelper } from "../utils/authHelper";
import { BookingHistoryPage } from "../pages/BookingHistoryPage";

// TC20: Xem lịch sử đặt phòng
interface HistoryData {
  roomName: string;
  checkIn: string;
  checkOut: string;
  expectedTotal: string;
}

const historyData = readFileFromCSV<HistoryData>("bookingHistoryData.csv");
const userData = readFileFromCSV<any>("userData.csv")[0];

test.describe("TC20 - View Booking History", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    await AuthHelper.login(
      page,
      userData.email,
      userData.password,
      userData.fullName,
    );
  });

  for (const data of historyData) {
    test(`Verify history details for: ${data.roomName}`, async ({
      page,
    }, testInfo) => {
      const bookingHistoryPage = new BookingHistoryPage(page, testInfo);

      // Bước 1: Vào Dashboard
      await bookingHistoryPage.navigateToDashboard();

      // Bước 2: Kiểm tra thẻ phòng ở Dashboard
      await bookingHistoryPage.verifyBookedRoomVisible(data.roomName);

      // Bước 3: Click vào thẻ để chuyển trang
      await bookingHistoryPage.clickRoomCardViewDetail(data.roomName);

      // Bước 4: Kiểm tra chi tiết trên trang cụ thể
      await bookingHistoryPage.verifyBookingDetailOnSpecifiPage(
        data.roomName,
        data.checkIn,
        data.checkOut,
        data.expectedTotal,
      );
    });
  }
});
