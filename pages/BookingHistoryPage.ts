import { Page, Locator, TestInfo, expect } from "@playwright/test";
import { UIHelper } from "../utils/uiHelper";

export class BookingHistoryPage {
  readonly page: Page;
  readonly testInfo: TestInfo;
  readonly avatarIcon: Locator;
  readonly dashboardLink: Locator;
  readonly rentedRoomsHeader: Locator;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.avatarIcon = page
      .locator('.ant-avatar, img[src*="avatar"], button.rounded-full')
      .first();
    this.dashboardLink = page
      .locator('[href="/info-user"]')
      .or(page.getByText("Dashboard"));
    this.rentedRoomsHeader = page
      .getByRole("heading", { name: "Phòng đã thuê", level: 1 })
      .or(page.getByText("Phòng đã thuê"));
  }

  // Bước 1: Vào Dashboard
  async navigateToDashboard() {
    console.log("[BookingHistory] Đang truy cập Dashboard...");
    // await this.page.waitForLoadState("networkidle");

    await UIHelper.clickWithSnap(
      this.page,
      this.avatarIcon,
      this.testInfo.title,
      "history-1-click-avatar",
    );

    if (await this.dashboardLink.isVisible())
      await UIHelper.clickWithSnap(
        this.page,
        this.dashboardLink,
        this.testInfo.title,
        "history-2-click-dashboard",
      );

    await this.page.waitForURL(/\/info-user/);
    await this.rentedRoomsHeader.waitFor({ state: "visible" });
    await this.rentedRoomsHeader.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    await UIHelper.snapshotOnly(
      this.page,
      this.rentedRoomsHeader,
      this.testInfo.title,
      "history-3-dashboard-view",
    );
  }

  // Bước 2: Verify phòng có ở Dashboard
  async verifyBookedRoomVisible(roomName: string) {
    console.log(`[BookingHistory] Kiểm tra phòng trên Dashboard: ${roomName}`);
    const roomTitle = this.page
      .locator(".text-xl")
      .filter({ hasText: roomName })
      .filter()
      .first();
    await roomTitle.scrollIntoViewIfNeeded();
    await expect(roomTitle).toBeVisible();
  }

  // Bước 3: Click thẻ phòng
  async clickRoomCardViewDetail(roomName: string) {
    console.log(`[BookingHistory] click vào thẻ phòng để xem chi tiết....`);
    const roomTitle = this.page
      .locator(".text-xl")
      .filter({ hasText: roomName })
      .first();
    const roomCardLink = roomTitle.locator("xpath=ancestor::a").first();

    await Promise.all([
      this.page.waitForURL(/\/room-detail\/\d+/),
      UIHelper.clickWithSnap(
        this.page,
        roomCardLink,
        this.testInfo.title,
        "history-4-click-room-card",
      ),
    ]);
    // await this.page.waitForLoadState("networkidle");
  }

  // Bước 4: Kiểm tra chi tiết 4 thông tin trên trang cụ thể
  async verifyBookingDetailOnSpecifiPage(
    expectedRoomName: string,
    expectedCheckIn: string,
    expectedCheckOut: string,
    expectedTotal: string,
  ) {
    console.log(
      `[BookingHistory] Xác minh 4 thông tin chi tiết trên trang cụ thể...`,
    );

    // 1. Tên phòng
    const roomNameEl = this.page
      .locator("h2.text-3xl")
      .filter({ hasText: expectedRoomName });
    await expect(roomNameEl).toBeVisible();

    // 2. Ngày nhận phòng
    const checkInBox = this.page
      .locator(".cursor-pointer")
      .filter({ hasText: "Nhận phòng" });
    await expect.soft(checkInBox).toContainText(expectedCheckIn);

    // 3. Ngày trả phòng
    const checkOutBox = this.page
      .locator(".cursor-pointer")
      .filter({ hasText: "Trả phòng" });
    await expect.soft(checkOutBox).toContainText(expectedCheckOut);

    // 4. Tổng tiền thanh toán
    const totalRow = this.page
      .locator(".flex.justify-between")
      .filter({ hasText: "Total before taxes" });
    const totalAmount = totalRow.locator(".font-mono");
    await expect(totalAmount).toContainText(expectedTotal);

    // highlight & chụp ảnh khu vực chứa giá tiền
    const priceCard = this.page.locator(".p-6.rounded-lg.border-2").first();
    await priceCard.scrollIntoViewIfNeeded();
    await UIHelper.snapshotOnly(
      this.page,
      priceCard,
      this.testInfo.title,
      "history-5-verified-details",
    );

    console.log(
      "[BookingHistory] Đã xác minh thành công 4 thông tin: Tên, Nhận phòng, Trả phòng, Tổng tiền.",
    );
  }
}
