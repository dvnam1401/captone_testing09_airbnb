export class PriceHelper {
  static converPriceToNumber(priceString: string): number {
    if (!priceString) return 0;
    // Loại bỏ mọi ký tự không phải số hoặc dấu chấm
    const cleanString = priceString.replace(/[^0-9.-]+/g, "");
    return parseFloat(cleanString);
  }

  // Tính tổng tiền dự kiến
  static calculatorTotal(
    pricePerNight: number,
    nights: number,
    claningFee: number,
  ): number {
    return pricePerNight * nights + claningFee;
  }
}
