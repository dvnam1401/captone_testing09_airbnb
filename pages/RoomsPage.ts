import { Page, Locator, expect } from '@playwright/test';

export class RoomsPage {
  readonly page: Page;
  readonly roomLinks: Locator;
  readonly roomCards: Locator;
  readonly emptyStateTitle: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomLinks = page.locator('a[href^="/room-detail/"]');
    this.roomCards = page.locator('a[href^="/room-detail/"]');
    this.emptyStateTitle = page.getByRole('heading', { name: /không thể tìm thấy phòng|khong the tim thay phong/i });
    this.noResultsMessage = page.locator('p').filter({ hasText: /không tìm thấy phòng phù hợp|khong tim thay phong phu hop/i }).first();
  }

  async goto(timeout: number = 10000): Promise<void> {
    await this.page.goto('https://demo5.cybersoft.edu.vn/rooms', { timeout, waitUntil: 'networkidle' });
  }

  async gotoBySlug(slug: string, timeout: number = 10000): Promise<void> {
    await this.page.goto(`https://demo5.cybersoft.edu.vn/rooms/${slug}`, { timeout, waitUntil: 'networkidle' });
  }

  async expectLoaded(expectedSlug?: string): Promise<void> {
    if (expectedSlug) {
      await expect(this.page).toHaveURL(new RegExp(`/rooms/${expectedSlug}$`));
      return;
    }
    await expect(this.page).toHaveURL(/\/rooms(\/.*)?$/);
  }

  async expectHasResults(): Promise<void> {
    const links = await this.roomLinks.count();
    const cards = await this.roomCards.count();
    expect(links > 0 || cards > 0).toBeTruthy();
  }

  async expectResultsOrEmptyState(): Promise<void> {
    const links = await this.roomLinks.count();
    const cards = await this.roomCards.count();
    const hasEmpty = await this.emptyStateTitle.count();
    expect(links > 0 || cards > 0 || hasEmpty > 0).toBeTruthy();
  }

  async hasResults(): Promise<boolean> {
    const links = await this.roomLinks.count();
    const cards = await this.roomCards.count();
    return links > 0 || cards > 0;
  }

  async openFirstRoomDetail(): Promise<void> {
    await expect(this.roomLinks.first()).toBeVisible({ timeout: 10000 });
    await this.roomLinks.first().click();
  }

  async expectFirstRoomCardHasFullInfo(): Promise<void> {
    const card = this.roomCards.first();
    await expect(card).toBeVisible();

    const imageCount = await card.locator('img').count();
    const titleCount = await card.locator('h1, h2, h3, h4, h5, p').count();
    const text = (await card.innerText()).trim();
    const hasPrice = /\d[\d.,]*\s*(₫|VND|\$|USD|\/\s*đêm|\/\s*night)?/i.test(text);
    const lineCount = text.split('\n').map((s) => s.trim()).filter(Boolean).length;

    expect(imageCount).toBeGreaterThan(0);
    expect(titleCount).toBeGreaterThan(0);
    // At least 3 text lines usually indicates title + location/description + price/rating.
    expect(lineCount).toBeGreaterThanOrEqual(3);
    expect(hasPrice).toBeTruthy();
  }

  async expectNoResultsState(): Promise<void> {
    const hasHeading = await this.emptyStateTitle.count();
    const hasMessage = await this.noResultsMessage.count();
    expect(hasHeading > 0 || hasMessage > 0).toBeTruthy();
  }
}
