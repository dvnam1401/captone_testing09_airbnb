// TC18: Đặt phòng thất bại - Chưa đăng nhập
// TC19: Đặt phòng thất bại - Ngày không hợp lệ

import { test, expect } from "@playwright/test";
import { readFileFromCSV } from "../utils/csvReader";
import { HomePage } from "../pages/HomePage";
import { RoomListPage } from "../pages/RoomListPage";
import { RoomDetailPage } from "../pages/RoomDetailPage";
import { AuthHelper } from "../utils/authHelper";
import { CalendarHelper } from "../utils/calendarHelper";
import { UIHelper } from "../utils/uiHelper";

interface UnauthorizedBookingData {
  cityName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  guests: string;
  expectedMessage: string;
}

interface InvalidDateData {
  cityName: string;
  roomName: string;
  firstClickDate: string;
  secondClickDate: string;
  expectedStart: string;
  expectedEnd: string;
}
const unauthorizedData = readFileFromCSV<UnauthorizedBookingData>(
  "unauthorizedBooking.csv",
);

const invalidDateData = readFileFromCSV<any>("invalidDateData.csv");
const userData = readFileFromCSV<any>("userData.csv")[0];
// TC18: Đặt phòng thất bại - Chưa đăng nhập
test.describe("MODULE 3: BOOKING FLOW - NEGATIVE CASES", () => {
  test.describe("TC18 - Booking Failed: User Not Logged In", () => {
    for (const data of unauthorizedData) {
      test(`Đặt phòng thất bại khi chưa đăng nhập: ${data.cityName} -> ${data.roomName}`, async ({
        page,
      }, testInfo) => {
        const homePage = new HomePage(page, testInfo);
        const roomListPage = new RoomListPage(page, testInfo);
        const roomDetailPage = new RoomDetailPage(page, testInfo);

        // 1. Truy cập trang chủ và chọn thành phố
        await page.goto("/");
        const usernameLabel = page.locator("span.ml-3");
        await expect(usernameLabel).not.toBeVisible();
        console.log(
          "[TC18] Xác nhận người dùng chưa đăng nhập - menu 'Đăng nhập'/'Đăng ký' hiển thị",
        );
        await homePage.selectLocation(data.cityName);

        // 2. Chọn phòng
        await roomListPage.selectRoom(data.roomName);

        // 3. Chọn ngày và khách
        await roomDetailPage.selectDate(data.checkIn, data.checkOut);
        await roomDetailPage.setGuests(parseInt(data.guests));

        // 4. Click nút đặt phòng
        await roomDetailPage.clickBook();

        //5. Kiểm tra thông báo lỗi hiển thị
        const errorMessage = page.getByText(data.expectedMessage);
        await expect(errorMessage).toBeVisible();

        // 6. Kiểm tra URL không bị chuyển trang
        await expect(page).toHaveURL(/\/room-detail\/\d+/);
      });
    }
  });

  test.describe("TC19 - Đặt phòng với ngày không hợp lệ (Proactive Validation)", () => {
    test.beforeEach(async ({ page }, testInfo) => {
      await AuthHelper.login(
        page,
        userData.email,
        userData.password,
        userData.fullName,
      );
    });
    for (const data of invalidDateData) {
      test(`Đặt phòng với ngày không hợp lệ: Click ${data.firstClickDate} then ${data.secondClickDate}`, async ({
        page,
      }, testInfo) => {
        const homePage = new HomePage(page, testInfo);
        const roomListPage = new RoomListPage(page, testInfo);
        const roomDetailPage = new RoomDetailPage(page, testInfo);

        await homePage.selectLocation(data.cityName);
        await roomListPage.selectRoom(data.roomName);

        await roomDetailPage.openCalendar();

        console.log(`[TC19] Click lần 1 (Ngày sau): ${data.firstClickDate}`);
        await CalendarHelper.pickDate(page, data.firstClickDate);
        await page.waitForTimeout(500); // Chờ UI cập nhật

        console.log(`[TC19] Click lần 2 (Ngày trước): ${data.secondClickDate}`);
        await CalendarHelper.pickDate(page, data.secondClickDate);
        await page.waitForTimeout(500); // Chờ UI cập nhật

        await roomDetailPage.closeCalendar();

        const displayedText = await roomDetailPage.getDateRangeDisplay();
        console.log(`[TC19] Kết quả hiển thị trên UI: "${displayedText}"`);

        // Chụp ảnh bằng chứng
        await UIHelper.snapshotOnly(
          page,
          roomDetailPage.checkInTrigger,
          testInfo.title,
          "verify-date-correction",
        );

        expect(displayedText).toContain(data.expectedStart);
        expect(displayedText).toContain(data.expectedEnd);
      });
    }
  });
});
