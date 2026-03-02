import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly userMenuButton: Locator;
  readonly destinationTrigger: Locator;
  readonly destinationDropdown: Locator;
  readonly destinationValue: Locator;
  readonly dateRangeTrigger: Locator;
  readonly addGuestTrigger: Locator;
  readonly guestPopup: Locator;
  readonly guestCountText: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.userMenuButton = page
      .locator("button:has(img[src='https://cdn-icons-png.flaticon.com/512/6596/6596121.png'])")
      .or(page.locator('button.bg-main.rounded-full:has(img)'));

    this.destinationTrigger = page.locator('div.cursor-pointer').filter({ hasText: 'Địa điểm' }).first();
    this.destinationDropdown = page.getByRole('heading', { name: 'Tìm kiếm địa điểm' }).locator('..');
    this.destinationValue = this.destinationTrigger.locator('p').nth(1);

    this.dateRangeTrigger = page.locator('p').filter({ hasText: '–' }).first();

    this.addGuestTrigger = page.locator('div.cursor-pointer').filter({ hasText: 'Thêm khách' }).first();
    this.guestPopup = this.addGuestTrigger;
    this.guestCountText = this.guestPopup.locator('*').filter({ hasText: /^\d+$/ }).first();

    this.searchButton = page.locator('.bg-main.ml-5').first();
  }

  async goto(timeout: number = 6000): Promise<void> {
    await this.page.goto('https://demo5.cybersoft.edu.vn/', { timeout, waitUntil: 'domcontentloaded' });
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
}
