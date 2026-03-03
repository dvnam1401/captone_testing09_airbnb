import { Page, Locator, TestInfo, expect } from "@playwright/test";
import { UIHelper } from "../utils/uiHelper";

export class HomePage {
  readonly page: Page;
  readonly testInfo?: TestInfo;
  readonly locationCard: Locator;
  readonly userMenuButton: Locator;
  readonly dangNhapButton: Locator;
  readonly dangKyButton: Locator;
  readonly destinationTrigger: Locator;
  readonly destinationDropdown: Locator;
  readonly destinationValue: Locator;
  readonly dateRangeTrigger: Locator;
  readonly addGuestTrigger: Locator;
  readonly guestPopup: Locator;
  readonly guestCountText: Locator;
  readonly searchButton: Locator;

  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.locationCard = page.locator('a[href^="/rooms/"]');
    this.userMenuButton = page.locator("button:has(img[src*='6596121.png'])").or(page.locator("button.bg-main.rounded-full:has(img)"));
    this.dangKyButton = page.getByRole("button", { name: "Đăng Ký" }).or(page.locator("li.py-2:has-text('Đăng Ký')"));
    this.dangNhapButton = page.getByRole("button", { name: "Đăng Nhập" }).or(page.locator("li.py-2:has-text('Đăng Nhập')"));
    this.destinationTrigger = page.locator('div.cursor-pointer').filter({ hasText: 'Địa điểm' }).first();
    this.destinationDropdown = page.getByRole('heading', { name: 'Tìm kiếm địa điểm' }).locator('..');
    this.destinationValue = this.destinationTrigger.locator('p').nth(1);
    this.dateRangeTrigger = page.locator('p').filter({ hasText: '–' }).first();
    this.addGuestTrigger = page.locator('div.cursor-pointer').filter({ hasText: 'Thêm khách' }).first();
    this.guestPopup = this.addGuestTrigger;
    this.guestCountText = this.guestPopup.locator('*').filter({ hasText: /^\d+$/ }).first();
    this.searchButton = page.locator('.bg-main.ml-5').first();
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

  async selectDestination(city: string): Promise<void> {
    await expect(this.destinationTrigger).toBeVisible({ timeout: 6000 });
    await this.destinationTrigger.click();

    await expect(this.destinationDropdown).toBeVisible({ timeout: 6000 });
    await this.destinationDropdown.getByText(city, { exact: true }).click();
  }

  async openDateRange(): Promise<void> {
    await expect(this.dateRangeTrigger).toBeVisible({ timeout: 6000 });
    await this.dateRangeTrigger.click();
  }

  async selectDateRange(checkInDay: string, checkOutDay: string): Promise<void> {
    await this.openDateRange();
    const calendars = this.page.locator('.rdrMonths .rdrMonth');
    await expect(calendars.first()).toBeVisible({ timeout: 6000 });
    await calendars.first().getByText(checkInDay, { exact: true }).click();
    await calendars.nth(1).getByText(checkOutDay, { exact: true }).click();
  }

  async setCalendarMonthYear(monthIndex: number, year: number): Promise<void> {
    await this.page.locator('.rdrMonthPicker select').first().selectOption(String(monthIndex));
    await this.page.locator('.rdrYearPicker select').first().selectOption(String(year));
  }

  async selectDayInMonth(monthPosition: 0 | 1, day: string): Promise<void> {
    const month = this.page.locator('.rdrMonth').nth(monthPosition);
    await month
      .locator('button.rdrDay:not(.rdrDayPassive):not(.rdrDayDisabled)', { hasText: day })
      .first()
      .click({ force: true });
  }

  async getVisibleMonthNames(): Promise<string[]> {
    return this.page.locator('.rdrMonthName').allTextContents();
  }

  async clickPrevMonth(): Promise<void> {
    await this.page.locator('.rdrPprevButton').click();
  }

  async openGuestFilter(): Promise<void> {
    await expect(this.addGuestTrigger).toBeVisible({ timeout: 6000 });
    await this.addGuestTrigger.click();
    await expect(this.guestPopup.getByText('Khách', { exact: true })).toBeVisible({ timeout: 6000 });
  }

  async addAdults(times: number): Promise<void> {
    await this.openGuestFilter();
    const plusBtn = this.guestPopup.locator('button').filter({ hasText: '+' }).first();
    for (let i = 0; i < times; i++) {
      await plusBtn.click();
    }
  }

  async clickSearch(): Promise<void> {
    await expect(this.searchButton).toBeVisible({ timeout: 6000 });
    await this.searchButton.click();
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