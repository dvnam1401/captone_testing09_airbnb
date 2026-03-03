import test, { Page, Locator } from "@playwright/test";
import { mkdirSync } from "fs";
import { join } from "path";

export class UIHelper {
  // hàm hightlight một element trên UI
  static async highlightElement(locator: Locator) {
    // 1. đợi element hiển thị
    await locator.waitFor({ state: "visible" });

    // 2. highlight element (viền đỏ nền vàng)
    await locator.evaluate((el) => {
      (el as HTMLElement).style.outline  = "4px solid red";
      (el as HTMLElement).style.backgroundColor = "yellow";
    });
  }

  // hàm remove highlight một element trên UI
  static async removeHighlight(locator: Locator) {
    // remove highlight element
    if (await locator.isVisible().catch(() => false)) {
      await locator.evaluate((el) => {
        (el as HTMLElement).style.outline  = "";
        (el as HTMLElement).style.backgroundColor = "";
      });
    }
  }

  // hàm chụp ảnh và lưu file
  static async takeScreenshot(page: Page, testName: string, stepName: string) {
    // Chuẩn bị đường dẫn lưu ảnh
    // Loại bỏ ký tự đặc biệt trong tên để tránh lỗi file hệ thống
    const safeTestName = testName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const safeStepName = stepName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    // Folder: root/screenshots/<test-name>/
    const screenshotDir = join(__dirname, "..", "screenshots", safeTestName);

    // Tạo folder nếu chưa tồn tại
    mkdirSync(screenshotDir, { recursive: true });

    // chụp màn hình
    const filePath = join(screenshotDir, `${safeStepName}.png`);
    await page.screenshot({ path: filePath });
  }

  /**
   * Highlight -> Chụp -> Click -> Xóa Highlight
   * Giúp theo dõi trực quan quá trình click
   */
  static async clickWithSnap(
    page: Page,
    locator: Locator,
    testName: string,
    stepName: string,
  ) {
    await this.highlightElement(locator);
    await this.takeScreenshot(page, testName, stepName);
    // await this.removeHighlight(locator);
    await locator.click();
  }

  //   Highlight -> Chụp -> Nhập liệu (Fill) -> Xóa Highlight
  static async fillWithSnap(
    page: Page,
    locator: Locator,
    value: string,
    testName: string,
    stepName: string,
  ) {
    await this.highlightElement(locator);
    await this.takeScreenshot(page, testName, stepName);
    // await this.removeHighlight(locator);
    await locator.fill(value);
  }

  /**
   * Chỉ chụp ảnh bằng chứng
   * Ví dụ: Verify giá tiền xong chụp lại
   */
  static async snapshotOnly(
    page: Page,
    locator: Locator,
    testName: string,
    stepName: string,
  ) {
    await this.highlightElement(locator);
    await this.takeScreenshot(page, testName, stepName);
    await this.removeHighlight(locator);
  }
}
