import { Page, Locator, expect, TestInfo } from "@playwright/test";
import { PriceHelper } from "../utils/priceHelper";
import { CalendarHelper } from "../utils/calendarHelper";
import { UIHelper } from "../utils/uiHelper";

export class RoomDetailPage {
  readonly page: Page;
  readonly testInfo?: TestInfo;
  readonly checkInTrigger: Locator;
  readonly checkOutTrigger: Locator;
  readonly datePickerPopup: Locator;
  readonly guestPlusBtn: Locator;
  readonly guestMinusBtn: Locator;
  readonly guestCountLabel: Locator;
  readonly formulaLine: Locator;
  readonly cleaningFeeLabel: Locator;
  readonly totalLabel: Locator;
  readonly bookButton: Locator;
  readonly successMessage: Locator;
  readonly title: Locator;
  readonly images: Locator;
  readonly body: Locator;

  constructor(page: Page, testInfo?: TestInfo) {
    this.page = page;
    this.testInfo = testInfo;
    this.checkInTrigger = page
      .locator("div.font-bold", { hasText: "Nhận phòng" })
      .locator("..");
    this.checkOutTrigger = page
      .locator("div.font-bold", { hasText: "Trả phòng" })
      .locator("..");
    this.datePickerPopup = page.locator(".rdrDateRangePickerWrapper");
    this.guestPlusBtn = page.getByRole("button", { name: "+" });
    this.guestMinusBtn = page.getByRole("button", { name: "-" });
    this.guestCountLabel = page
      .locator("div")
      .filter({ hasText: /^\d+\s*khách$/ })
      .first();
    this.formulaLine = page.locator("p").filter({ hasText: /X \d+ nights/ });
    this.cleaningFeeLabel = page
      .getByText("Cleaning fee")
      .locator("..")
      .locator("p.font-bold")
      .first();
    this.totalLabel = page
      .getByText("Total before taxes")
      .locator("..")
      .locator("p.font-bold")
      .nth(1);
    this.bookButton = page.getByRole("button", { name: "Đặt phòng" });
    this.successMessage = page.getByText("Thêm mới thành công!");
    this.title = page.locator('h1, h2').first();
    this.images = page.locator('img');
    this.body = page.locator('body');
  }

  async goto(roomId: string = '1'): Promise<void> {
    await this.page.goto(`https://demo5.cybersoft.edu.vn/room-detail/${roomId}`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/room-detail\/\d+$/);
    await expect(this.title).toBeVisible();
  }

  async expectMainInfoVisible(): Promise<void> {
    await expect(this.images.first()).toBeVisible();
    await expect(this.body).toContainText(/\$|\d+\s*\/\s*dem|VND|USD/i);
  }

  async openCalendar() {
    await this.page.waitForURL(/.*room-detail.*/);

    if (this.testInfo) {
      await UIHelper.clickWithSnap(
        this.page,
        this.checkInTrigger,
        this.testInfo.title,
        "3-open-calendar",
      );
    } else {
      await this.checkInTrigger.click();
    }
    
    await this.datePickerPopup.waitFor({ state: "visible" });
  }

  async closeCalendar() {
    await this.page.keyboard.press("Escape");
    await this.datePickerPopup.waitFor({ state: "hidden" });
  }

  async selectDate(checkIn: string, checkOut: string) {
    await this.openCalendar();
    await CalendarHelper.pickDate(this.page, checkIn);
    await CalendarHelper.pickDate(this.page, checkOut);
    await this.closeCalendar();
  }

  private async getCurrentGuestCount(): Promise<number> {
    const text = await this.guestCountLabel.innerText();
    const numberGuest = parseInt(text.replace(/[^0-9]/g, ""));
    return numberGuest;
  }

  async setGuests(targetCount: number) {
    let currentCount = await this.getCurrentGuestCount();

    while (currentCount < targetCount) {
      const stepName = `4-guest-increase-to-${currentCount + 1}`;

      if (this.testInfo) {
        await UIHelper.clickWithSnap(
          this.page,
          this.guestPlusBtn,
          this.testInfo.title,
          stepName,
        );
      } else {
        await this.guestPlusBtn.click();
      }

      await this.page.waitForTimeout(200);
      currentCount = await this.getCurrentGuestCount();
    }

    while (currentCount > targetCount) {
      const stepName = `2-guest-decrease-to-${currentCount - 1}`;

      if (this.testInfo) {
        await UIHelper.clickWithSnap(
          this.page,
          this.guestMinusBtn,
          this.testInfo.title,
          stepName,
        );
      } else {
        await this.guestMinusBtn.click();
      }

      await this.page.waitForTimeout(200);
      currentCount = await this.getCurrentGuestCount();
    }
  }

  async clickBook() {
    if (this.testInfo) {
      await UIHelper.clickWithSnap(
        this.page,
        this.bookButton,
        this.testInfo.title,
        "6-click-book-submit",
      );
    } else {
      await this.bookButton.click();
    }
  }

  async confirmBookingSuccess() {
    const confirmBtn = this.page.getByRole("button", { name: "Xác nhận" });
    if (await confirmBtn.isVisible()) {
      if (this.testInfo) {
        await UIHelper.clickWithSnap(
          this.page,
          confirmBtn,
          this.testInfo.title,
          "7-confirm-booking",
        );
      } else {
        await confirmBtn.click();
      }
    }
  }

  async getBookingCaculationInfo() {
    await this.formulaLine.waitFor();

    if (this.testInfo) {
      await UIHelper.highlightElement(this.formulaLine);
    }
    
    const formulaText = await this.formulaLine.innerText();
    const match = formulaText.match(/\$(\d+)\s*X\s*(\d+)\s*nights/);

    let pricePerNight = 0;
    let nights = 0;
    if (match) {
      pricePerNight = parseInt(match[1]);
      nights = parseInt(match[2]);
    }
    
    let cleaningFee = 0;
    if (await this.cleaningFeeLabel.isVisible()) {
      if (this.testInfo) {
        await UIHelper.highlightElement(this.cleaningFeeLabel);
      }
      const cleaningText = await this.cleaningFeeLabel.innerText();
      cleaningFee = PriceHelper.converPriceToNumber(cleaningText);
    }

    const totalText = await this.totalLabel.innerText();
    
    if (this.testInfo) {
      await UIHelper.snapshotOnly(
        this.page,
        this.totalLabel,
        this.testInfo.title,
        "5-verify-price-info",
      );
    }
    
    const displayedTotal = PriceHelper.converPriceToNumber(totalText);
    return { pricePerNight, nights, cleaningFee, displayedTotal };
  }

  async getDateRangeDisplay(): Promise<string> {
    const startText = await this.checkInTrigger.innerText();
    const endText = await this.checkOutTrigger.innerText();
    console.log(`[UI Date] check-in: ${startText} | check-out: ${endText}`);
    return `${startText} - ${endText}`;
  }
}