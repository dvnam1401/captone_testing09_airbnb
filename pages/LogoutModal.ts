import { Page, Locator } from "@playwright/test";

export class LogoutModal {
    readonly page: Page;

    readonly emailInput: Locator;
    readonly passwordInput: Locator
    readonly submitButton: Locator;
    readonly userMenuButton: Locator;
    readonly signOutButton: Locator;

    readonly modal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator('.ant-modal-content')

        this.emailInput = page.locator("input#email").or(page.getByRole("textbox", { name: "email" }))
        this.passwordInput = page.locator("input#password").or(page.getByRole("textbox", { name: "password" }))
        this.submitButton = page.locator("button[type='submit']").or(page.getByRole("button", { name: "Đăng nhập" }))
        this.userMenuButton = page.locator("#user-menu-button");
        this.signOutButton = page.getByRole("button", { name: "Sign out" });

    }

    async waitForModal(timeout: number = 6000): Promise<void> {
        await this.modal.waitFor({ state: 'visible', timeout });
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.page.waitForTimeout(1000);
    }
    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
        await this.page.waitForTimeout(1000);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
        await this.page.waitForTimeout(1000);
    }

    async logout(): Promise<void> {
        await this.userMenuButton.click();
        await this.signOutButton.click();
    }

}