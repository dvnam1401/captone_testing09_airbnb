import { Page, Locator, TestInfo } from "@playwright/test";
import { UIHelper } from "../utils/uiHelper";

export class HomePage {
  readonly page: Page;
  readonly testInfo?: TestInfo;
  readonly locationCard: Locator;
  readonly userMenuButton: Locator;
  readonly dangNhapButton: Locator;
  readonly dangKyButton: Locator;

  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.locationCard = page.locator('a[href^="/rooms/"]');
    this.userMenuButton = page.locator("button:has(img[src*='6596121.png'])").or(page.locator("button.bg-main.rounded-full:has(img)"));
    this.dangKyButton = page.getByRole("button", { name: "Đăng Ký" }).or(page.locator("li.py-2:has-text('Đăng Ký')"));
    this.dangNhapButton = page.getByRole("button", { name: "Đăng Nhập" }).or(page.locator("li.py-2:has-text('Đăng Nhập')"));
  }

  async goto(timeout: number = 60000): Promise<void> {
    await this.page.goto('https://demo5.cybersoft.edu.vn/', { timeout, waitUntil: 'networkidle' });
  }

  async selectLocation(locationName: string): Promise<void> {
    console.log(`[HomePage] Đang chọn địa điểm: ${locationName}`);
    const cityCard = this.locationCard
      .filter({ hasText: locationName })
      .first();

    await cityCard.scrollIntoViewIfNeeded();
    await cityCard.waitFor({ state: "visible", timeout: 10000 });
    
    if (this.testInfo) {
      await UIHelper.clickWithSnap(
        this.page,
        cityCard,
        this.testInfo.title,
        `1-homepage-select-location-${locationName}`,
      );
    } else {
      await cityCard.click();
    }
    
    await this.page.waitForURL(/\/rooms\/.*/);
  }

  async clickUserMenu(): Promise<void> {
    await this.userMenuButton.waitFor({ state: 'visible', timeout: 6000 });
    await this.userMenuButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickDangKyButton(): Promise<void> {
    await this.dangKyButton.waitFor({ state: 'visible', timeout: 6000 });
    await this.dangKyButton.click();
    await this.page.waitForTimeout(2000);
  }

  async clickDangNhapButton(): Promise<void> {
    await this.dangNhapButton.waitFor({ state: 'visible', timeout: 6000 });
    await this.dangNhapButton.click();
  }

  async logout(): Promise<void> {
    await this.userMenuButton.waitFor({ state: 'visible' });
    await this.userMenuButton.click();

    const signOutButton = this.page.getByRole("button", { name: "Sign out" });
    await signOutButton.waitFor({ state: 'visible' });
    await signOutButton.click();
  }
}