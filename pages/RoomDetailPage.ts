import { Page, Locator, expect } from '@playwright/test';

export class RoomDetailPage {
  readonly page: Page;
  readonly title: Locator;
  readonly images: Locator;
  readonly body: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1, h2').first();
    this.images = page.locator('img');
    this.body = page.locator('body');
  }

  async goto(roomId: string = '1'): Promise<void> {
    await this.page.goto(`https://demo5.cybersoft.edu.vn/room-detail/${roomId}`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/room-detail\/\d+$/);
    await expect(this.title).toBeVisible();
  }

  async expectMainInfoVisible(): Promise<void> {
    await expect(this.images.first()).toBeVisible();
    await expect(this.body).toContainText(/\$|\d+\s*\/\s*dem|VND|USD/i);
  }
}
