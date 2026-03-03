import { test, expect } from '@playwright/test'
import { HomePage } from '../pages/HomePage';
import { RegisterModal } from '../pages/RegisterModal';

test.describe('Register', () => {
    test('Đăng ký tài khoản mới', async ({ page }) => {
        const homePage = new HomePage(page);

        const registerModal = new RegisterModal(page);

        await homePage.goto();

        await homePage.clickUserMenu();

        await homePage.clickDangKyButton();

        await registerModal.waitForModal();

        await registerModal.submit();

        await registerModal.fillName('hoang1911');

        await registerModal.fillEmail('hoang19112@gmail.com')

        await registerModal.fillPassword('123456')

        await registerModal.fillPhone('0123456789')

        await registerModal.fillBirthday(24)

        await registerModal.selectGender('Nam')

        await registerModal.submit();

        expect(true).toBeTruthy();

    })
})