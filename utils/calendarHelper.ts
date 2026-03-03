import { Page, Locator, expect } from "@playwright/test";
import { UIHelper } from "./uiHelper";

export class CalendarHelper {
  static async pickDate(page: Page, dateString: string) {
    // 1. Parse ngày đầu vào
    const targetDate = this.parseDate(dateString);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    // 2. Loop để kiểm tra và chuyển tháng
    for (let i = 0; i < 24; i++) {
      // Giới hạn 24 lần để tránh vòng lặp vô hạn
      // Lấy thông tin tháng/năm đang hiển thị trên UI
      // Selector .rdrMonthName lấy từ HTML bạn cung cấp (VD: "Jan 2026")
      const currentLabel = await page
        .locator(".rdrMonthName")
        .first()
        .innerText();
      const { month: currentMonth, year: currentYear } =
        this.parseMonthYearLabel(currentLabel);

      // Logic so sánh:
      // Nếu (Năm hiện tại < Năm đích) HOẶC (Cùng năm nhưng Tháng hiện tại < Tháng đích)
      // => Cần click Next
      if (
        currentYear < targetYear ||
        (currentYear === targetYear && currentMonth < targetMonth)
      ) {
        // click nút Next
        // await page.locator(".rdrNextButton").click();
        const nextBtn = page.locator(".rdrNextButton");
        await UIHelper.highlightElement(nextBtn);
        await UIHelper.removeHighlight(nextBtn);
        await nextBtn.click();

        // Chờ UI cập nhật text tháng mới (Tránh click quá nhanh)
        // Ta chờ text của tháng đổi khác với text cũ
        await expect(page.locator(".rdrMonthName").first()).not.toHaveText(
          currentLabel,
        );
      } else if (
        currentYear > targetYear ||
        (currentYear === targetYear && currentMonth > targetMonth)
      ) {
        // Điều hướng về tháng trước
        const prevBtn = page.locator(".rdrPprevButton");
        await UIHelper.highlightElement(prevBtn);
        await UIHelper.removeHighlight(prevBtn);
        await prevBtn.click();
        await expect(page.locator(".rdrMonthName").first()).not.toHaveText(
          currentLabel,
        );
      }
      // Nếu đã đúng tháng năm
      else {
        break;
      }
    }
    // 3. Click vào ngày cụ thể
    await this.clickDay(page, targetDate.getDate());
  }

  // Click vào ngày cụ thể trong tháng đang hiển thị
  private static async clickDay(page: Page, day: number) {
    // Selector logic:
    // .rdrDay: Thẻ chứa ngày
    // :not(.rdrDayPassive): Loại bỏ ngày mờ của tháng trước/sau
    // :not(.rdrDayDisabled): Loại bỏ ngày bị khóa
    // .rdrDayNumber span: Thẻ chứa số ngày
    const dayLocator = page
      .locator(
        ".rdrDay:not(.rdrDayPassive):not(.rdrDayDisabled) .rdrDayNumber span",
      )
      .filter({ hasText: `${day}` }); // Regex ^...$ để tìm chính xác số (tránh tìm 1 ra 10, 11)

    if ((await dayLocator.count()) > 0) {
      // await dayLocator.first().click();

      const targetDay = dayLocator.first();
      await UIHelper.highlightElement(targetDay);
      await UIHelper.removeHighlight(targetDay);
      await targetDay.click();
    } else {
      const allDays = await page.locator(".rdrDay").allTextContents();
      console.log("Tất cả ngày có trên lịch:", allDays);
      throw new Error(
        `Không tìm thấy ngày ${day} (hoặc ngày bị disable) trên lịch.`,
      );
    }
  }
  // Chuyển string "27/01/2026" -> Date Object
  private static parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  // Chuyển text "Jan 2026" -> { month: 0, year: 2026 }
  private static parseMonthYearLabel(label: string): {
    month: number;
    year: number;
  } {
    const [monthString, yearString] = label.trim().split(" ");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      month: months.indexOf(monthString),
      year: parseInt(yearString),
    };
  }
}
