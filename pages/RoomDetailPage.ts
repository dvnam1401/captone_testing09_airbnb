import { Page, Locator, expect, TestInfo } from "@playwright/test";
import { PriceHelper } from "../utils/priceHelper";
import { CalendarHelper } from "../utils/calendarHelper";
import { UIHelper } from "../utils/uiHelper";

export class RoomDetailPage {
  readonly page: Page;
  readonly testInfo: TestInfo; // Biến để lưu thông tin test case hiện tại
  // 1. ngày nhận phòng/trả phòng
  readonly checkInTrigger: Locator;
  readonly checkOutTrigger: Locator;
  readonly datePickerPopup: Locator;

  // 2. số lượng khách
  readonly guestPlusBtn: Locator;
  readonly guestMinusBtn: Locator;
  readonly guestCountLabel: Locator;

  // 3. giá phòng và phí vệ sinh
  readonly formulaLine: Locator; // dòng chứa tiền x số đêm
  readonly cleaningFeeLabel: Locator; // phí vệ sinh
  readonly totalLabel: Locator; // tổng tiền

  // Đặt phòng và thông báo thành công
  readonly bookButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page, testInfo: TestInfo) {
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
    // this.cleaningFeeLabel = page
    //   .locator("p")
    //   .filter({ hasText: "Cleaning fee" })
    //   .locator("p.font-bold");
    this.cleaningFeeLabel = page
      .getByText("Cleaning fee")
      .locator("..")
      .locator("p.font-bold")
      .first();
    // this.totalLabel = page
    //   .locator("div")
    //   .filter({ hasText: "Total before taxes" })
    //   .locator("p.font-bold").first();
    this.totalLabel = page
      .getByText("Total before taxes")
      .locator("..")
      .locator("p.font-bold")
      .nth(1);
    this.bookButton = page.getByRole("button", { name: "Đặt phòng" });
    this.successMessage = page.getByText("Thêm mới thành công!");
  }

  // Mở popup lịch
  async openCalendar() {
    // Đảm bảo đang ở trang chi tiết
    await this.page.waitForURL(/.*room-detail.*/);

    // highlight và click mở lịch
    await UIHelper.clickWithSnap(
      this.page,
      this.checkInTrigger,
      this.testInfo.title,
      "3-open-calendar",
    );
    // Chờ popup hiển thị
    await this.datePickerPopup.waitFor({ state: "visible" });
  }
  // Đóng popup lịch
  async closeCalendar() {
    await this.page.keyboard.press("Escape");

    // chờ popup biến mất
    await this.datePickerPopup.waitFor({ state: "hidden" });
  }

  async selectDate(checkIn: string, checkOut: string) {
    // 1. mở lịch
    await this.openCalendar();

    // 2. chọn ngày
    await CalendarHelper.pickDate(this.page, checkIn);
    await CalendarHelper.pickDate(this.page, checkOut);

    // 4. chờ popup lịch biến mất
    await this.closeCalendar();
  }

  // =================================================================
  // PHẦN 2: CÁC HÀM XỬ LÝ KHÁCH & ĐẶT PHÒNG
  // =================================================================

  // lấy số sách hiện tại từ UI
  private async getCurrentGuestCount(): Promise<number> {
    const text = await this.guestCountLabel.innerText();
    const numberGuest = parseInt(text.replace(/[^0-9]/g, ""));
    return numberGuest;
  }

  async setGuests(targetCount: number) {
    // Đọc số khách hiện tại
    let currentCount = await this.getCurrentGuestCount();

    // nếu currentCount < mong muốn -> click +
    while (currentCount < targetCount) {
      // tên step: guest-increase-to-<số khách>
      const stepName = `4-guest-increase-to-${currentCount + 1}`;

      // await this.guestPlusBtn.click();
      await UIHelper.clickWithSnap(
        this.page,
        this.guestPlusBtn,
        this.testInfo.title,
        stepName,
      );

      await this.page.waitForTimeout(200); // chờ UI cập nhật

      currentCount = await this.getCurrentGuestCount();
    }

    // nếu currentCount > mong muốn -> click -
    while (currentCount > targetCount) {
      const stepName = `2-guest-decrease-to-${currentCount - 1}`;
      // await this.guestMinusBtn.click();

      await UIHelper.clickWithSnap(
        this.page,
        this.guestMinusBtn,
        this.testInfo.title,
        stepName,
      );

      await this.page.waitForTimeout(200); // chờ UI cập nhật

      currentCount = await this.getCurrentGuestCount();
    }
  }

  async clickBook() {
    // await this.bookButton.click();
    await UIHelper.clickWithSnap(
      this.page,
      this.bookButton,
      this.testInfo.title,
      "6-click-book-submit",
    );
  }

  async confirmBookingSuccess() {
    const confirmBtn = this.page.getByRole("button", { name: "Xác nhận" });
    if (await confirmBtn.isVisible()) {
      //  await confirmBtn.click();
      await UIHelper.clickWithSnap(
        this.page,
        confirmBtn,
        this.testInfo.title,
        "7-confirm-booking",
      );
    }
  }

  // =================================================================
  // PHẦN 3: VERIFY & DATA GETTERS
  // =================================================================

  async getBookingCaculationInfo() {
    await this.formulaLine.waitFor();

    await UIHelper.highlightElement(this.formulaLine);
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
      await UIHelper.highlightElement(this.cleaningFeeLabel);
      const cleaningText = await this.cleaningFeeLabel.innerText();
      cleaningFee = PriceHelper.converPriceToNumber(cleaningText);
    }

    const totalText = await this.totalLabel.innerText();
    // Chụp ảnh bằng chứng giá tiền
    await UIHelper.snapshotOnly(
      this.page,
      this.totalLabel,
      this.testInfo.title,
      "5-verify-price-info",
    );
    const displayedTotal = PriceHelper.converPriceToNumber(totalText);
    return { pricePerNight, nights, cleaningFee, displayedTotal };
  }

  // Lấy text ngày tháng đang hiển thị trên UI (Dùng cho TC19)
  async getDateRangeDisplay(): Promise<string> {
    // lấy text ô nhận phòng
    const startText = await this.checkInTrigger.innerText();
    // lấy text ô trả phòng
    const endText = await this.checkOutTrigger.innerText();

    console.log(`[UI Date] check-in: ${startText} | check-out: ${endText}`);

    return `${startText} - ${endText}`;
  }
}
