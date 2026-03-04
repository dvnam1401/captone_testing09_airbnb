import { Page, Locator } from "@playwright/test";
export class LoginPage {
  readonly page: Page;
  readonly avatarIcon: Locator;
  readonly loginMenuItem: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly successMessage: Locator;
  readonly usernameLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.avatarIcon = page.locator("button.rounded-full");
    // this.loginMenuItem = page.locator("(//button[text()='Đăng nhập'])[1]");
    this.loginMenuItem = page
      .getByRole("button", { name: "Đăng nhập" })
      .first();
    // this.emailInput = page.locator("#email");
    this.emailInput = page.getByLabel('Email');
    // this.emailInput = page.getByPlaceholder("Vui lòng nhập tài khoản");
    // this.passwordInput = page.locator("#password");
    this.passwordInput = page.getByLabel('Mật khẩu');
    // this.passwordInput = page.getByPlaceholder("Vui lòng nhập mật khẩu");
    // this.loginButton = page.locator("button.bg-black");
    this.loginButton = page.getByRole('button', { name: 'Đăng nhập' });
    // this.successMessage = page.locator(
    //   "//span[normalize-space()='Đăng nhập thành công']",
    // );
    this.successMessage = page.getByText('Đăng nhập thành công');
    this.usernameLabel = page.locator("span.ml-3");
  }

  async login(email: string, password: string): Promise<void> {
    // Bước 1: Truy cập trang chủ (để thấy được Avatar)
    await this.page.goto("https://demo5.cybersoft.edu.vn/");

    // Bước 2: Click vào Avatar icon
    await this.avatarIcon.click();

    // Bước 3: Chọn mục "Đăng nhập" từ menu
    await this.loginMenuItem.click();

    // Bước 4: Điền thông tin (Thêm waitFor để đảm bảo form đã hiện ra)
    await this.emailInput.waitFor({ state: "visible" });
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    // Bước 5: Submit form
    await this.loginButton.click();
    // Bước 6: Đợi điều hướng sau khi login thành công (quan trọng)
    // Thường sau khi login sẽ reload hoặc redirect về trang chủ
    // await this.successMessage.waitFor({ state: "visible", timeout: 10000 });
  }
}
