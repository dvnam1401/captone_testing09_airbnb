import { Page, Locator } from '@playwright/test';

export class RegisterModal {
    readonly page: Page;

    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly phoneInput: Locator;
    readonly birthdayInput: Locator;
    readonly genderSelect: Locator;
    readonly submitButton: Locator;
    readonly modal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.locator('.ant-modal-content')

        this.nameInput = page.locator("input#name").or(page.getByRole("textbox", { name: "name" }))

        this.emailInput = page.locator("input#email").or(page.getByRole("textbox", { name: "email" }))

        this.passwordInput = page.locator("input#password").or(page.getByRole("textbox", { name: "password" }))

        this.phoneInput = page.locator("input#phone").or(page.getByRole("textbox", { name: "phone" }))

        this.birthdayInput = page.locator("input#birthday").or(page.getByRole("textbox", { name: "birthday" }))

        this.genderSelect = page.locator("div.ant-select[name='gender']")

        this.submitButton = page.locator("button[type='submit']").or(page.getByRole("button", { name: "Đăng ký" }))

    }

    async waitForModal(timeout: number = 6000): Promise<void> {
        await this.modal.waitFor({ state: 'visible', timeout });
    }

    async fillName(name: string): Promise<void> {
        await this.nameInput.fill(name);
        await this.page.waitForTimeout(1000);
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.page.waitForTimeout(1000);
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
        await this.page.waitForTimeout(1000);
    }

    async fillPhone(phone: string): Promise<void> {
        await this.phoneInput.fill(phone);
        await this.page.waitForTimeout(1000);
    }

    async fillBirthday(day: number = 24): Promise<void> {
        await this.birthdayInput.click();
        await this.page.waitForTimeout(500);

        const dayCells = this.page.locator(".ant-picker-cell:not(.ant-picker-cell-disabled)");
        const targetDay = dayCells.filter({ hasText: day.toString() }).first();
        await targetDay.first().click();
    }

    async selectGender(gender: string): Promise<void> {
        await this.genderSelect.click();
        await this.page.waitForTimeout(500);

        const option = this.page.locator(`div.ant-select-item-option-content:has-text("${gender}")`);
        await option.click();
        await this.page.waitForTimeout(1000);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
        await this.page.waitForTimeout(1000);
    }

}