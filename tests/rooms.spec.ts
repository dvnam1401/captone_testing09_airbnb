import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RoomsPage } from '../pages/RoomsPage';

test.describe('Rooms Page', () => {
  test('Mo truc tiep trang danh sach phong', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    await roomsPage.goto();
    await roomsPage.expectLoaded();
    await roomsPage.expectHasResults();
    await page.waitForTimeout(5000);
  });

  test('Chon dia diem va xac minh the phong hien thi day du thong tin', async ({ page }) => {
    const homePage = new HomePage(page);
    const roomsPage = new RoomsPage(page);
    const candidateDestinations = ['Hồ Chí Minh', 'Cần Thơ', 'Nha Trang', 'Hà Nội', 'Phú Quốc'];
    let foundResults = false;

    for (const city of candidateDestinations) {
      await homePage.goto(15000);
      await homePage.selectDestination(city);
      await homePage.clickSearch();

      await roomsPage.expectLoaded();
      foundResults = await roomsPage.hasResults();
      if (foundResults) break;
    }

    if (foundResults) {
      await roomsPage.expectFirstRoomCardHasFullInfo();
    } else {
      await roomsPage.expectNoResultsState();
    }
  });
});
