import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

const now = new Date();
const currentYear = now.getFullYear();
const nextYear = currentYear + 1;
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

test.describe('Home - Destination', () => {
  test('Search theo địa điểm (ví dụ: "Hồ Chí Minh")', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.selectDestination('Hồ Chí Minh');
    await expect(homePage.destinationValue).toContainText(/Hồ Chí Minh/i);

    await homePage.clickSearch();
    await expect(page).toHaveURL(/\/rooms\/ho-chi-minh$/);
  });
});

test.describe('Home - Booking Date', () => {
  // test.beforeEach(async ({ page }) => {
  //   await page.setViewportSize({ width: 1600, height: 1200 });
  // });

  test(' Chon ngay qua thang (Apr -> May)', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.openDateRange();
    await homePage.setCalendarMonthYear(3, currentYear); // April
    await homePage.selectDayInMonth(0, '30');
    await homePage.selectDayInMonth(1, '2');

    await expect(homePage.dateRangeTrigger).toContainText(
      new RegExp(`30\\/04\\/${currentYear}\\s*[\\u2013-]\\s*02\\/05\\/${currentYear}`)
    );
  });

  test('Chon ngay qua nam (Dec -> Jan)', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.openDateRange();
    await homePage.setCalendarMonthYear(11, currentYear); // December
    await homePage.selectDayInMonth(0, '28');
    await homePage.selectDayInMonth(1, '3');

    await expect(homePage.dateRangeTrigger).toContainText(
      new RegExp(`28\\/12\\/${currentYear}\\s*[\\u2013-]\\s*03\\/01\\/${nextYear}`)
    );
  });

  test('Chon checkout truoc checkin thi he thong tu sap xep lai range', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.openDateRange();
    await homePage.selectDayInMonth(0, '20');
    await homePage.selectDayInMonth(0, '10');

    await expect(homePage.dateRangeTrigger).toContainText(
      new RegExp(`10\\/${currentMonth}\\/${currentYear}\\s*[\\u2013-]\\s*20\\/${currentMonth}\\/${currentYear}`)
    );
  });

  test('Khong thao tac chon ngay van search duoc do co range mac dinh', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.clickSearch();

    await expect(page).toHaveURL(/\/rooms$/);
  });

  test('Khong cho lui ve thang qua khu tren datepicker', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.openDateRange();
    const before = await homePage.getVisibleMonthNames();
    await homePage.clickPrevMonth();
    const after = await homePage.getVisibleMonthNames();

    expect(after).toEqual(before);
  });

  test('Search theo so khach', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.addAdults(2); // từ 1 -> 3
    await expect(homePage.guestCountText).toHaveText('3');

    await homePage.clickSearch();
    await expect(page).toHaveURL(/\/rooms/);
  });

  
});
