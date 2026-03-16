import { MealRecord } from '@/services/GoogleSheetsService';
import { formatDateToDDMMYYYY } from './formatting';
import { booleanToBinary, calculateTotal } from './calculations';

/**
 * Interface cho dữ liệu form
 */
export interface MealFormData {
  date: string;              // Format: YYYY-MM-DD
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
 * Chuyển đổi dữ liệu form sang định dạng dòng Google Sheets
 * 
 * @param formData - Dữ liệu từ form
 * @param id - ID tự động tăng
 * @returns Bản ghi MealRecord để lưu vào Google Sheets
 * 
 * Validates: Requirements 4.5.3, 4.5.6, 4.5.7
 */
export function formDataToSheetRow(formData: MealFormData, id: number): MealRecord {
  // Chuyển đổi boolean sang 0/1
  const breakfast = booleanToBinary(formData.breakfast);
  const lunch = booleanToBinary(formData.lunch);
  const dinner = booleanToBinary(formData.dinner);
  const multiplier = formData.isHoliday ? 2 : 1;
  
  // Tính tổng
  const total = calculateTotal(
    formData.breakfast,
    formData.lunch,
    formData.dinner,
    formData.breakfastPrice,
    formData.lunchPrice,
    formData.dinnerPrice,
    multiplier
  );
  
  // Chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
  const date = formatDateToDDMMYYYY(formData.date);
  
  return {
    id,
    date,
    employeeName: formData.employeeName.trim(),
    breakfast,
    lunch,
    dinner,
    multiplier: multiplier as 1 | 2,
    total
  };
}
