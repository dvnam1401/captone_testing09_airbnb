import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage';
import { LoginModal } from '../pages/LoginModal';

test.describe('Login', () => {
    test('Đăng nhập với tài khoản đã đăng ký', async ({ page }) => {
        const homePage = new HomePage(page);

        const loginModal = new LoginModal(page);
        await homePage.goto();

        await homePage.clickUserMenu();

        await homePage.clickDangNhapButton();

        await loginModal.waitForModal();

        await loginModal.fillEmail('hoang1911@gmail.com')

        await loginModal.fillPassword('123456')

        await loginModal.submit();

        expect(true).toBeTruthy();
    })
}) 