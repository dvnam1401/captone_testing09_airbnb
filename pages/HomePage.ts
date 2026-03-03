// chứa danh sách các thành phố.
import { Page, Locator, TestInfo, expect } from "@playwright/test";
import { UIHelper } from "../utils/uiHelper";

export class HomePage {
  readonly page: Page;
  readonly testInfo: TestInfo;
  readonly locationCard: Locator;

  constructor(page: Page, testInfo: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.locationCard = page.locator('a[href^="/rooms/"]');
  }

  // Chọn địa điểm dựa trên tên (VD: "Hồ Chí Minh")
  async selectLocation(locationName: string): Promise<void> {
    console.log(`[HomePage] Đang chọn địa điểm: ${locationName}`);
    // Tìm card có chứa tên thành phố
    const cityCard = this.locationCard
      .filter({ hasText: locationName })
      .first();

    // const visible = await cityCard.isVisible({ timeout: 10000 });
    // // scroll tới và click vào card
    // await cityCard.scrollIntoViewIfNeeded();
    // if (visible) {
    //   console.log("Element đang hiển thị");
    //   // await cityCard.click();
    //   // Dùng UIHelper để click và chụp ảnh
    //   await UIHelper.clickWithSnap(
    //     this.page,
    //     cityCard,
    //     this.testInfo.title,
    //     `1-homepage-select-location-${locationName}`,
    //   );
    //   console.log(`[HomePage] Đã click vào địa điểm: ${locationName}`);
    // } else {
    //   console.log("Element KHÔNG hiển thị");
    //   await this.page.waitForTimeout(2000);
    // }
    await cityCard.scrollIntoViewIfNeeded();
    await cityCard.waitFor({ state: "visible", timeout: 10000 });
    await UIHelper.clickWithSnap(
      this.page,
      cityCard,
      this.testInfo.title,
      `1-homepage-select-location-${locationName}`,
    );
    await this.page.waitForURL(/\/rooms\/.*/);
  }
}
