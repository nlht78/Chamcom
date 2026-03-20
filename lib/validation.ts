/**
 * Kiểm tra tên nhân viên
 * 
 * @param name - Tên nhân viên cần kiểm tra
 * @returns true nếu hợp lệ, false nếu không hợp lệ
 * 
 * Validates: Requirements 4.1.5
 */
export function validateEmployeeName(name: string): boolean {
  // Bắt buộc, không rỗng sau khi trim
  return typeof name === 'string' && name.trim().length > 0;
}

/**
 * Kiểm tra ngày
 * 
 * @param date - Chuỗi ngày cần kiểm tra (định dạng YYYY-MM-DD)
 * @returns true nếu hợp lệ, false nếu không hợp lệ
 * 
 * Validates: Requirements 4.1.5
 */
export function validateDate(date: string): boolean {
  // Bắt buộc, không rỗng
  if (!date || typeof date !== 'string' || date.trim().length === 0) {
    return false;
  }
  
  // Kiểm tra định dạng YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }
  
  // Kiểm tra ngày hợp lệ
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  // Kiểm tra xem ngày có hợp lệ không bằng cách so sánh các thành phần
  return dateObj.getFullYear() === year && 
         dateObj.getMonth() === month - 1 && 
         dateObj.getDate() === day;
}

/**
 * Kiểm tra giá
 * 
 * @param price - Giá cần kiểm tra
 * @returns true nếu hợp lệ (số dương), false nếu không hợp lệ
 * 
 * Validates: Requirements 4.2.4
 */
export function validatePrice(price: number): boolean {
  // Chỉ số dương, không phải Infinity
  return typeof price === 'number' && !isNaN(price) && isFinite(price) && price > 0;
}

/**
 * Interface cho dữ liệu form
 */
export interface FormData {
  date: string;
  employeeName: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  isHoliday: boolean;
}

/**
 * Kết quả kiểm tra form
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Kiểm tra khoảng ngày
 *
 * @param startDate - Ngày bắt đầu (YYYY-MM-DD)
 * @param endDate - Ngày kết thúc (YYYY-MM-DD)
 * @returns ValidationResult với các key lỗi: startDate, endDate, dateRange
 *
 * Validates: Requirements 2.5, 2.6, 2.7
 */
export function validateDateRange(startDate: string, endDate: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (!validateDate(startDate)) {
    errors.startDate = 'Vui lòng chọn ngày hợp lệ';
  }

  if (!validateDate(endDate)) {
    errors.endDate = 'Vui lòng chọn ngày hợp lệ';
  }

  // Chỉ kiểm tra quan hệ và khoảng khi cả hai ngày đều hợp lệ
  if (!errors.startDate && !errors.endDate) {
    if (endDate < startDate) {
      errors.dateRange = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1; // bao gồm cả hai đầu mút
      if (diffDays > 31) {
        errors.dateRange = 'Khoảng ngày tối đa là 31 ngày';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Kiểm tra tất cả các trường trong form
 * 
 * @param formData - Dữ liệu form cần kiểm tra
 * @returns Kết quả kiểm tra với danh sách lỗi (nếu có)
 * 
 * Validates: Requirements 4.1.5, 4.2.4
 */
export function validateForm(formData: FormData): ValidationResult {
  const errors: Record<string, string> = {};
  
  // Kiểm tra ngày
  if (!validateDate(formData.date)) {
    errors.date = 'Vui lòng chọn ngày hợp lệ';
  }
  
  // Kiểm tra tên nhân viên
  if (!validateEmployeeName(formData.employeeName)) {
    errors.employeeName = 'Vui lòng nhập tên nhân viên';
  }
  
  // Kiểm tra giá sáng
  if (!validatePrice(formData.breakfastPrice)) {
    errors.breakfastPrice = 'Giá sáng phải là số dương';
  }
  
  // Kiểm tra giá trưa
  if (!validatePrice(formData.lunchPrice)) {
    errors.lunchPrice = 'Giá trưa phải là số dương';
  }
  
  // Kiểm tra giá chiều
  if (!validatePrice(formData.dinnerPrice)) {
    errors.dinnerPrice = 'Giá chiều phải là số dương';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
