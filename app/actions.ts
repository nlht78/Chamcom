'use server';

import { GoogleSheetsService } from '@/services/GoogleSheetsService';
import { formatDateToDDMMYYYY } from '@/lib/formatting';
import { booleanToBinary, calculateTotal } from '@/lib/calculations';

export interface MealFormData {
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

export interface SaveResult {
  success: boolean;
  message: string;
  id?: number;
  error?: string;
}

export async function saveMealRecord(data: MealFormData): Promise<SaveResult> {
  try {
    // Validate input data
    if (!data.date || !data.employeeName.trim()) {
      return {
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
      };
    }

    if (data.breakfastPrice <= 0 || data.lunchPrice <= 0 || data.dinnerPrice <= 0) {
      return {
        success: false,
        message: 'Giá phải là số dương',
      };
    }

    // Calculate total on server to verify
    const multiplier = data.isHoliday ? 2 : 1;
    const total = calculateTotal(
      data.breakfast,
      data.lunch,
      data.dinner,
      data.breakfastPrice,
      data.lunchPrice,
      data.dinnerPrice,
      multiplier
    );

    // Format data for Google Sheets
    const sheetsService = new GoogleSheetsService();

    const record = {
      id: 0, // ID assigned by Apps Script
      date: formatDateToDDMMYYYY(data.date),
      employeeName: data.employeeName.trim(),
      breakfast: booleanToBinary(data.breakfast),
      lunch: booleanToBinary(data.lunch),
      dinner: booleanToBinary(data.dinner),
      multiplier: multiplier as 1 | 2,
      total,
    };

    // Append to Google Sheets
    const result = await sheetsService.appendMealRecord(record);

    if (result.success) {
      return {
        success: true,
        message: 'Lưu thành công!',
        id: result.id,
      };
    } else {
      return {
        success: false,
        message: 'Không thể lưu dữ liệu. Vui lòng thử lại.',
        error: result.error,
      };
    }
  } catch (error) {
    console.error('Error saving meal record:', error);
    return {
      success: false,
      message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function saveMealRecords(dataList: MealFormData[]): Promise<SaveResult> {
  try {
    if (dataList.length === 0) {
      return { success: false, message: 'Không có dữ liệu để lưu' };
    }

    const sheetsService = new GoogleSheetsService();
    const records = dataList.map((data) => {
      const multiplier = data.isHoliday ? 2 : 1;
      const total = calculateTotal(
        data.breakfast, data.lunch, data.dinner,
        data.breakfastPrice, data.lunchPrice, data.dinnerPrice,
        multiplier
      );
      return {
        id: 0,
        date: formatDateToDDMMYYYY(data.date),
        employeeName: data.employeeName.trim(),
        breakfast: booleanToBinary(data.breakfast),
        lunch: booleanToBinary(data.lunch),
        dinner: booleanToBinary(data.dinner),
        multiplier: multiplier as 1 | 2,
        total,
      };
    });

    const result = await sheetsService.appendMealRecords(records);
    if (result.success) {
      return { success: true, message: `Đã lưu ${dataList.length} bản ghi thành công!` };
    }
    return { success: false, message: 'Không thể lưu dữ liệu. Vui lòng thử lại.', error: result.error };
  } catch (error) {
    return { success: false, message: 'Đã xảy ra lỗi.', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
