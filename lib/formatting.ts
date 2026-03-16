/**
 * Định dạng số tiền với dấu phân cách hàng nghìn và hậu tố đ
 * 
 * @param amount - Số tiền cần định dạng
 * @returns Chuỗi định dạng (ví dụ: "72.000đ")
 * 
 * Validates: Requirements 4.4.3
 */
export function formatCurrency(amount: number): string {
  // Sử dụng toLocaleString với locale 'de-DE' để có dấu chấm làm phân cách hàng nghìn
  const formatted = amount.toLocaleString('de-DE');
  return `${formatted}đ`;
}

/**
 * Chuyển đổi ngày từ định dạng YYYY-MM-DD sang DD/MM/YYYY
 * 
 * @param dateString - Chuỗi ngày ở định dạng YYYY-MM-DD (HTML date input)
 * @returns Chuỗi ngày ở định dạng DD/MM/YYYY
 * 
 * Validates: Requirements 4.5.5
 */
export function formatDateToDDMMYYYY(dateString: string): string {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Chuyển đổi ngày từ định dạng DD/MM/YYYY sang YYYY-MM-DD
 * 
 * @param dateString - Chuỗi ngày ở định dạng DD/MM/YYYY
 * @returns Chuỗi ngày ở định dạng YYYY-MM-DD (cho HTML date input)
 * 
 * Validates: Requirements 4.5.5
 */
export function formatDateToYYYYMMDD(dateString: string): string {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
}
