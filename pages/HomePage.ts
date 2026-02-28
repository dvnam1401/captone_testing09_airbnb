import { Page, Locator } from '@playwright/test'

export class HomePage {
    readonly page: Page;

    readonly userMenuButton: Locator;
    readonly dangNhapButton: Locator;
    readonly dangKyButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.userMenuButton = page.locator("button:has(img[src*='6596121.png'])").or(page.locator("button.bg-main.rounded-full:has(img)"));
        this.dangKyButton = page.getByRole("button", { name: "Đăng Ký" }).or(page.locator("li.py-2:has-text('Đăng Ký')"));
        this.dangNhapButton = page.getByRole("button", { name: "Đăng Nhập" }).or(page.locator("li.py-2:has-text('Đăng Nhập')"));

    }

    async goto(timeout: number = 60000): Promise<void> {
        await this.page.goto('https:demo5.cybersoft.edu.vn/', { timeout, waitUntil: 'networkidle' });
    }

    async clickUserMenu(): Promise<void> {
        await this.userMenuButton.waitFor({ state: 'visible', timeout: 6000 });
        await this.userMenuButton.click();
        await this.page.waitForTimeout(2000);
    }

    async clickDangKyButton(): Promise<void> {
        await this.dangKyButton.waitFor({ state: 'visible', timeout: 6000 })
        await this.dangKyButton.click();
        await this.page.waitForTimeout(2000);
    }

    async clickDangNhapButton(): Promise<void> {
        await this.dangNhapButton.waitFor({ state: 'visible', timeout: 6000 })
        await this.dangNhapButton.click();
    }

}