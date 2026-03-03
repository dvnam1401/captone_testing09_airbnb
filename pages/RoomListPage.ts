// danh sách phòng sau khi chọn thành phố
import { Page, Locator, expect, TestInfo } from "@playwright/test";
import { UIHelper } from "../utils/uiHelper";

export class RoomListPage {
  readonly page: Page;
  readonly testInfo: TestInfo;
  readonly roomCards: Locator;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.roomCards = page.locator(".ant-card");
  }

  // Chọn một phòng cụ thể từ danh sách
  async selectRoom(roomName: string): Promise<void> {
    console.log(`[RoomListPage] Đang tìm phòng: ${roomName}`);

    const targetCard = this.page
      .locator(".ant-card")
      .filter({ hasText: roomName })
      .first();
    
    await expect(targetCard).toBeAttached(); // đảm bảo phần thử đã nằm trong DOM
    await expect(targetCard).toBeVisible(); // đảm bảo phần tử đang hiển thị
    await expect(targetCard).toBeEnabled();
    await targetCard.scrollIntoViewIfNeeded();

    // Thực hiện click bằng helper
    await UIHelper.clickWithSnap(
      this.page,
      targetCard,
      this.testInfo.title,
      "2-roomlist-click-room",
    );

    // Sau đó mới đợi URL đổi
    await this.page.waitForURL(/\/room-detail\/\d+/, { timeout: 10000 });
  }
}
