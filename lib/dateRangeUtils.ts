/**
 * Tạo mảng các ngày liên tiếp từ startDate đến endDate (bao gồm cả hai đầu mút).
 * Trả về mảng rỗng nếu startDate > endDate.
 * @param startDate - Ngày bắt đầu định dạng YYYY-MM-DD
 * @param endDate - Ngày kết thúc định dạng YYYY-MM-DD
 * @returns Mảng các chuỗi ngày YYYY-MM-DD liên tiếp, sắp xếp tăng dần
 */
export function generateDateRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return [];
  if (start > end) return [];

  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    const year = current.getUTCFullYear();
    const month = String(current.getUTCMonth() + 1).padStart(2, '0');
    const day = String(current.getUTCDate()).padStart(2, '0');
    dates.push(`${year}-${month}-${day}`);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}

/**
 * Tính số ngày trong khoảng [startDate, endDate].
 * Trả về 0 nếu startDate > endDate.
 * @param startDate - Ngày bắt đầu định dạng YYYY-MM-DD
 * @param endDate - Ngày kết thúc định dạng YYYY-MM-DD
 * @returns Số ngày trong khoảng (bao gồm cả hai đầu mút)
 */
export function countDaysInRange(startDate: string, endDate: string): number {
  return generateDateRange(startDate, endDate).length;
}
