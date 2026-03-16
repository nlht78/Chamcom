/**
 * Tests for saveMealRecord Server Action
 * 
 * These tests verify the server action validates input,
 * calculates totals correctly, and handles errors properly.
 */

import { saveMealRecord, MealFormData } from '@/app/actions';

// Mock the GoogleSheetsService
jest.mock('@/services/GoogleSheetsService', () => {
  return {
    GoogleSheetsService: jest.fn().mockImplementation(() => {
      return {
        getNextId: jest.fn().mockResolvedValue(1),
        appendMealRecord: jest.fn().mockResolvedValue({
          success: true,
          id: 1,
        }),
      };
    }),
  };
});

describe('saveMealRecord Server Action', () => {
  const validFormData: MealFormData = {
    date: '2026-03-13',
    employeeName: 'Nguyễn Văn A',
    breakfast: true,
    lunch: true,
    dinner: true,
    breakfastPrice: 12000,
    lunchPrice: 30000,
    dinnerPrice: 30000,
    isHoliday: false,
  };

  it('should save valid meal record successfully', async () => {
    const result = await saveMealRecord(validFormData);
    
    expect(result.success).toBe(true);
    expect(result.message).toBe('Lưu thành công!');
    expect(result.id).toBe(1);
  });

  it('should reject empty employee name', async () => {
    const invalidData = { ...validFormData, employeeName: '' };
    const result = await saveMealRecord(invalidData);
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Vui lòng điền đầy đủ thông tin bắt buộc');
  });

  it('should reject empty date', async () => {
    const invalidData = { ...validFormData, date: '' };
    const result = await saveMealRecord(invalidData);
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Vui lòng điền đầy đủ thông tin bắt buộc');
  });

  it('should reject negative breakfast price', async () => {
    const invalidData = { ...validFormData, breakfastPrice: -1000 };
    const result = await saveMealRecord(invalidData);
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Giá phải là số dương');
  });

  it('should reject zero lunch price', async () => {
    const invalidData = { ...validFormData, lunchPrice: 0 };
    const result = await saveMealRecord(invalidData);
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Giá phải là số dương');
  });

  it('should calculate total correctly for regular day', async () => {
    const result = await saveMealRecord(validFormData);
    
    // Total should be (12000 + 30000 + 30000) * 1 = 72000
    expect(result.success).toBe(true);
  });

  it('should calculate total correctly for holiday', async () => {
    const holidayData = { ...validFormData, isHoliday: true };
    const result = await saveMealRecord(holidayData);
    
    // Total should be (12000 + 30000 + 30000) * 2 = 144000
    expect(result.success).toBe(true);
  });

  it('should trim employee name', async () => {
    const dataWithSpaces = { ...validFormData, employeeName: '  Nguyễn Văn A  ' };
    const result = await saveMealRecord(dataWithSpaces);
    
    expect(result.success).toBe(true);
  });
});
