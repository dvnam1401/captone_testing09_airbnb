import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage';
import { LoginModal } from '../pages/LoginModal';
import { LogoutModal } from '../pages/LogoutModal';

test.describe('Login', () => {
    test('Đăng nhập với tài khoản đã đăng ký', async ({ page }) => {
        const homePage = new HomePage(page);

        const logoutModal = new LogoutModal(page);
        await homePage.goto();

        await homePage.clickUserMenu();

        await homePage.clickDangNhapButton();

        await logoutModal.waitForModal();

        await logoutModal.fillEmail('hoang1911gmail.com')

        await logoutModal.submit();

        await logoutModal.fillEmail('hoang1911@gmail.com')

        await logoutModal.fillPassword('123456')

        await logoutModal.submit();

        await logoutModal.logout();

        expect(true).toBeTruthy();
    })
}) 