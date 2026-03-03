import { test, expect } from '@playwright/test';
import { RoomsPage } from '../pages/RoomsPage';
import { RoomDetailPage } from '../pages/RoomDetailPage';

async function openAnyRoomFromList(roomsPage: RoomsPage): Promise<boolean> {
  // Try a few list pages; open the first page that has room cards.
  const candidateSlugs = ['ho-chi-minh', 'can-tho', 'nha-trang', 'ha-noi', 'phu-quoc'];

  await roomsPage.goto();
  if (await roomsPage.hasResults()) {
    await roomsPage.openFirstRoomDetail();
    return true;
  }

  for (const slug of candidateSlugs) {
    await roomsPage.gotoBySlug(slug);
    if (await roomsPage.hasResults()) {
      await roomsPage.openFirstRoomDetail();
      return true;
    }
  }

  return false;
}

test.describe('Room Detail Page', () => {
  test('Truy cap trang chi tiet phong thanh cong', async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    const roomDetailPage = new RoomDetailPage(page);

    const opened = await openAnyRoomFromList(roomsPage);
    test.skip(!opened, 'Khong co phong trong danh sach o thoi diem chay test.');

    await roomDetailPage.expectLoaded();
  });

  test('Trang chi tiet phong hien thi day du thong tin', async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    const roomDetailPage = new RoomDetailPage(page);

    const opened = await openAnyRoomFromList(roomsPage);
    test.skip(!opened, 'Khong co phong trong danh sach o thoi diem chay test.');

    await roomDetailPage.expectLoaded();
    await roomDetailPage.expectMainInfoVisible();

    // Extra checks for "full information" in a simple way.
    await expect(page.locator('body')).toContainText(/\$|USD|VND|\/\s*đêm|\/\s*dem/i);
    await expect(page.locator('body')).toContainText(/khách|khach|phòng|phong|phòng tắm|phong tam/i);
  });
});
