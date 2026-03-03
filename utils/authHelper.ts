import { LoginPage } from "../pages/LoginPage";
import { Page, expect } from "@playwright/test";

export class AuthHelper {
  /**
   * Hàm login dùng chung cho toàn bộ dự án.
   * Đã bao gồm bước kiểm tra login thành công.
   */
  static async login(
    page: Page,
    email: string,
    pass: string,
    fullName: string,
  ) {
    const loginPage = new LoginPage(page);

    console.log(`[AuthHelper] Đang thực hiện login với user: ${email}`);

    // 1. Thực hiện thao tác login
    await loginPage.login(email, pass);

    // 2. Chờ login thành công
    const successToast = page.getByText("Đăng nhập thành công");
    await expect(successToast).toBeVisible();
    console.log(`[AuthHelper] Toast đã xuất hiện`);

    // chờ thông báo "Đăng nhập thành công" ẩn đi
    await successToast.waitFor({ state: "hidden" });
    console.log(`[AuthHelper] Toast đã biến mất, UI stable`);
    // ✅ Đợi network idle
    // await page.waitForLoadState("networkidle");

    // ✅ Verify URL
    await expect(page).toHaveURL("/");

    console.log(`[AuthHelper] Đăng nhập thành công! User: ${fullName}`);
  }
}
