/**
 * Tính toán tổng chi phí bữa ăn
 * 
 * @param breakfast - Có chọn bữa sáng (true/false)
 * @param lunch - Có chọn bữa trưa (true/false)
 * @param dinner - Có chọn bữa chiều (true/false)
 * @param breakfastPrice - Giá bữa sáng
 * @param lunchPrice - Giá bữa trưa
 * @param dinnerPrice - Giá bữa chiều
 * @param multiplier - Hệ số (1 = ngày thường, 2 = ngày lễ)
 * @returns Tổng chi phí
 * 
 * Validates: Requirements 4.4.1
 */
export function calculateTotal(
  breakfast: boolean,
  lunch: boolean,
  dinner: boolean,
  breakfastPrice: number,
  lunchPrice: number,
  dinnerPrice: number,
  multiplier: number
): number {
  const breakfastCost = breakfast ? breakfastPrice : 0;
  const lunchCost = lunch ? lunchPrice : 0;
  const dinnerCost = dinner ? dinnerPrice : 0;
  
  return (breakfastCost + lunchCost + dinnerCost) * multiplier;
}

/**
 * Chuyển đổi giá trị boolean sang 0 hoặc 1
 * 
 * @param value - Giá trị boolean
 * @returns 1 nếu true, 0 nếu false
 * 
 * Validates: Requirements 4.5.6
 */
export function booleanToBinary(value: boolean): 0 | 1 {
  return value ? 1 : 0;
}
