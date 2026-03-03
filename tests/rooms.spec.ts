import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { RoomsPage } from '../pages/RoomsPage';

async function openAnyRoomsListWithResults(roomsPage: RoomsPage): Promise<boolean> {
  const candidateSlugs = ['ho-chi-minh', 'can-tho', 'nha-trang', 'ha-noi', 'phu-quoc'];

  await roomsPage.goto();
  if (await roomsPage.hasResults()) return true;

  for (const slug of candidateSlugs) {
    await roomsPage.gotoBySlug(slug);
    if (await roomsPage.hasResults()) return true;
  }

  return false;
}

test.describe('Rooms Page', () => {
  test('Mo truc tiep trang danh sach phong', async ({ page }) => {
    const roomsPage = new RoomsPage(page);

    const foundResults = await openAnyRoomsListWithResults(roomsPage);
    test.skip(!foundResults, 'Khong co phong trong danh sach o thoi diem chay test.');

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
      await page.waitForTimeout(6000);
      foundResults = await roomsPage.hasResults();
      if (foundResults) break;
    }

    if (foundResults) {
      for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, 260);
        await page.waitForTimeout(250);
      }

      const totalCards = await roomsPage.roomCards.count();
      expect(totalCards).toBeGreaterThan(0);

      const randomIndex = Math.floor(Math.random() * totalCards);
      const randomCard = roomsPage.roomCards.nth(randomIndex);

      await randomCard.scrollIntoViewIfNeeded();
      await expect(randomCard).toBeVisible();

      const imageCount = await randomCard.locator('img').count();
      const titleCount = await randomCard.locator('h1, h2, h3, h4, h5, p').count();
      const text = (await randomCard.innerText()).trim();
      const hasPrice = /\d[\d.,]*\s*(₫|VND|\$|USD|\/\s*đêm|\/\s*dem|\/\s*night)?/i.test(text);
      const lineCount = text.split('\n').map((s) => s.trim()).filter(Boolean).length;

      expect(imageCount).toBeGreaterThan(0);
      expect(titleCount).toBeGreaterThan(0);
      expect(lineCount).toBeGreaterThanOrEqual(3);
      expect(hasPrice).toBeTruthy();
    } else {
      await roomsPage.expectNoResultsState();
    }
  });
});
});
