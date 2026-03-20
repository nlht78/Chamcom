import * as fc from 'fast-check';
import { 
  validateEmployeeName, 
  validateDate, 
  validatePrice, 
  validateForm,
  validateDateRange,
  FormData 
} from '../lib/validation';

describe('validateEmployeeName', () => {
  it('should return true for valid employee name', () => {
    expect(validateEmployeeName('Nguyễn Văn A')).toBe(true);
    expect(validateEmployeeName('Trần Thị B')).toBe(true);
    expect(validateEmployeeName('Lê Văn C')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(validateEmployeeName('')).toBe(false);
  });

  it('should return false for string with only whitespace', () => {
    expect(validateEmployeeName('   ')).toBe(false);
    expect(validateEmployeeName('\t')).toBe(false);
    expect(validateEmployeeName('\n')).toBe(false);
  });

  it('should return true for name with leading/trailing whitespace', () => {
    expect(validateEmployeeName('  Nguyễn Văn A  ')).toBe(true);
  });

  it('should return true for single character name', () => {
    expect(validateEmployeeName('A')).toBe(true);
  });
});

describe('validateDate', () => {
  it('should return true for valid date in YYYY-MM-DD format', () => {
    expect(validateDate('2026-03-13')).toBe(true);
    expect(validateDate('2026-04-30')).toBe(true);
    expect(validateDate('2024-12-31')).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(validateDate('')).toBe(false);
  });

  it('should return false for string with only whitespace', () => {
    expect(validateDate('   ')).toBe(false);
  });

  it('should return false for invalid date format', () => {
    expect(validateDate('13/03/2026')).toBe(false); // DD/MM/YYYY
    expect(validateDate('2026/03/13')).toBe(false); // YYYY/MM/DD
    expect(validateDate('13-03-2026')).toBe(false); // DD-MM-YYYY
    expect(validateDate('2026-3-13')).toBe(false);  // Single digit month
    expect(validateDate('2026-03-3')).toBe(false);  // Single digit day
  });

  it('should return false for invalid date values', () => {
    expect(validateDate('2026-13-01')).toBe(false); // Invalid month
    expect(validateDate('2026-02-30')).toBe(false); // Invalid day for February
    expect(validateDate('2026-04-31')).toBe(false); // Invalid day for April
  });

  it('should return false for non-date strings', () => {
    expect(validateDate('not a date')).toBe(false);
    expect(validateDate('abc-def-ghi')).toBe(false);
  });

  it('should return true for leap year date', () => {
    expect(validateDate('2024-02-29')).toBe(true);
  });

  it('should return false for invalid leap year date', () => {
    expect(validateDate('2023-02-29')).toBe(false);
  });
});

describe('validatePrice', () => {
  it('should return true for positive numbers', () => {
    expect(validatePrice(12000)).toBe(true);
    expect(validatePrice(30000)).toBe(true);
    expect(validatePrice(1)).toBe(true);
    expect(validatePrice(0.01)).toBe(true);
    expect(validatePrice(1000000)).toBe(true);
  });

  it('should return false for zero', () => {
    expect(validatePrice(0)).toBe(false);
  });

  it('should return false for negative numbers', () => {
    expect(validatePrice(-1)).toBe(false);
    expect(validatePrice(-12000)).toBe(false);
    expect(validatePrice(-0.01)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(validatePrice(NaN)).toBe(false);
  });

  it('should return false for Infinity', () => {
    expect(validatePrice(Infinity)).toBe(false);
    expect(validatePrice(-Infinity)).toBe(false);
  });
});

describe('validateForm', () => {
  const validFormData: FormData = {
    date: '2026-03-13',
    employeeName: 'Nguyễn Văn A',
    breakfast: true,
    lunch: true,
    dinner: true,
    breakfastPrice: 12000,
    lunchPrice: 30000,
    dinnerPrice: 30000,
    isHoliday: false
  };

  it('should return valid for complete valid form data', () => {
    const result = validateForm(validFormData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should return invalid when date is empty', () => {
    const formData = { ...validFormData, date: '' };
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.date).toBe('Vui lòng chọn ngày hợp lệ');
  });

  it('should return invalid when date format is wrong', () => {
    const formData = { ...validFormData, date: '13/03/2026' };
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.date).toBe('Vui lòng chọn ngày hợp lệ');
  });

  it('should return invalid when employee name is empty', () => {
    const formData = { ...validFormData, employeeName: '' };
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.employeeName).toBe('Vui lòng nhập tên nhân viên');
  });

  it('should return invalid when employee name is only whitespace', () => {
    const formData = { ...validFormData, employeeName: '   ' };
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.employeeName).toBe('Vui lòng nhập tên nhân viên');
  });

  it('should return invalid when breakfast price is zero', () => {
    const formData = { ...validFormData, breakfastPrice: 0 };
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.breakfastPrice).toBe('Giá sáng phải là số dương');
  });

  it('should return invalid when lunch price is negative', () => {
    const formData = { ...validFormData, lunchPrice: -1000 };
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.lunchPrice).toBe('Giá trưa phải là số dương');
  });

  it('should return invalid when dinner price is zero', () => {
    const formData = { ...validFormData, dinnerPrice: 0 };
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(result.errors.dinnerPrice).toBe('Giá chiều phải là số dương');
  });

  it('should return multiple errors when multiple fields are invalid', () => {
    const formData: FormData = {
      date: '',
      employeeName: '   ',
      breakfast: true,
      lunch: true,
      dinner: true,
      breakfastPrice: 0,
      lunchPrice: -1000,
      dinnerPrice: 0,
      isHoliday: false
    };
    const result = validateForm(formData);
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).length).toBe(5);
    expect(result.errors.date).toBe('Vui lòng chọn ngày hợp lệ');
    expect(result.errors.employeeName).toBe('Vui lòng nhập tên nhân viên');
    expect(result.errors.breakfastPrice).toBe('Giá sáng phải là số dương');
    expect(result.errors.lunchPrice).toBe('Giá trưa phải là số dương');
    expect(result.errors.dinnerPrice).toBe('Giá chiều phải là số dương');
  });

  it('should validate regardless of meal selection (checkboxes)', () => {
    const formData = { 
      ...validFormData, 
      breakfast: false, 
      lunch: false, 
      dinner: false 
    };
    const result = validateForm(formData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });

  it('should validate regardless of holiday status', () => {
    const formData = { ...validFormData, isHoliday: true };
    const result = validateForm(formData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
});

// ─── validateDateRange unit tests ────────────────────────────────────────────

describe('validateDateRange', () => {
  it('should return valid for equal start and end date', () => {
    const result = validateDateRange('2024-01-15', '2024-01-15');
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should return valid for a range within 31 days', () => {
    const result = validateDateRange('2024-01-01', '2024-01-31');
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('should return error when endDate < startDate', () => {
    const result = validateDateRange('2024-01-10', '2024-01-05');
    expect(result.isValid).toBe(false);
    expect(result.errors.dateRange).toBe('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
  });

  it('should return error when range exceeds 31 days', () => {
    const result = validateDateRange('2024-01-01', '2024-02-01'); // 32 days
    expect(result.isValid).toBe(false);
    expect(result.errors.dateRange).toBe('Khoảng ngày tối đa là 31 ngày');
  });

  it('should return startDate error for invalid startDate', () => {
    const result = validateDateRange('not-a-date', '2024-01-10');
    expect(result.isValid).toBe(false);
    expect(result.errors.startDate).toBe('Vui lòng chọn ngày hợp lệ');
  });

  it('should return endDate error for invalid endDate', () => {
    const result = validateDateRange('2024-01-01', '2024-13-01');
    expect(result.isValid).toBe(false);
    expect(result.errors.endDate).toBe('Vui lòng chọn ngày hợp lệ');
  });

  it('should return both date errors when both are invalid', () => {
    const result = validateDateRange('', '');
    expect(result.isValid).toBe(false);
    expect(result.errors.startDate).toBe('Vui lòng chọn ngày hợp lệ');
    expect(result.errors.endDate).toBe('Vui lòng chọn ngày hợp lệ');
  });

  it('should accept exactly 31-day range', () => {
    // 2024-01-01 to 2024-01-31 = 31 days
    const result = validateDateRange('2024-01-01', '2024-01-31');
    expect(result.isValid).toBe(true);
  });
});

// ─── Property-based tests ─────────────────────────────────────────────────────

// Feature: cham-com-theo-khoang-ngay, Property 6: Validation ngăn lưu khi dữ liệu không hợp lệ

describe('validateDateRange — Property 6: Validation ngăn lưu khi dữ liệu không hợp lệ', () => {
  /**
   * Helper: tạo chuỗi ngày YYYY-MM-DD từ Date
   */
  function toDateStr(d: Date): string {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  /**
   * Arbitrary sinh ngày hợp lệ trong khoảng 2000-01-01 đến 2099-12-31
   */
  const validDateArb = fc.date({
    min: new Date('2000-01-01'),
    max: new Date('2099-12-31'),
  }).map(toDateStr);

  /**
   * Validates: Requirements 2.5
   * endDate < startDate → isValid: false, errors.dateRange tồn tại
   */
  it('P6a: endDate < startDate luôn trả về isValid: false với lỗi dateRange', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 1, max: 30 }),
        (startStr, offsetDays) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() - offsetDays);
          const endStr = toDateStr(end);

          const result = validateDateRange(startStr, endStr);
          expect(result.isValid).toBe(false);
          expect(result.errors.dateRange).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 2.6
   * Khoảng > 31 ngày → isValid: false, errors.dateRange tồn tại
   */
  it('P6b: khoảng > 31 ngày luôn trả về isValid: false với lỗi dateRange', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 32, max: 365 }),
        (startStr, offsetDays) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays - 1); // +offsetDays-1 → range = offsetDays ngày
          const endStr = toDateStr(end);

          const result = validateDateRange(startStr, endStr);
          expect(result.isValid).toBe(false);
          expect(result.errors.dateRange).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 2.7
   * Chuỗi ngày không hợp lệ → isValid: false, errors.startDate hoặc errors.endDate tồn tại
   */
  it('P6c: startDate không hợp lệ luôn trả về isValid: false với lỗi startDate', () => {
    const invalidDateArb = fc.oneof(
      fc.constant(''),
      fc.constant('not-a-date'),
      fc.constant('2024-13-01'),
      fc.constant('2024-00-15'),
      fc.constant('2024-02-30'),
      fc.string({ minLength: 1, maxLength: 20 }).filter(s => !/^\d{4}-\d{2}-\d{2}$/.test(s)),
    );

    fc.assert(
      fc.property(
        invalidDateArb,
        validDateArb,
        (invalidStart, validEnd) => {
          const result = validateDateRange(invalidStart, validEnd);
          expect(result.isValid).toBe(false);
          expect(result.errors.startDate).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('P6d: endDate không hợp lệ luôn trả về isValid: false với lỗi endDate', () => {
    const invalidDateArb = fc.oneof(
      fc.constant(''),
      fc.constant('not-a-date'),
      fc.constant('2024-13-01'),
      fc.constant('2024-00-15'),
      fc.constant('2024-02-30'),
      fc.string({ minLength: 1, maxLength: 20 }).filter(s => !/^\d{4}-\d{2}-\d{2}$/.test(s)),
    );

    fc.assert(
      fc.property(
        validDateArb,
        invalidDateArb,
        (validStart, invalidEnd) => {
          const result = validateDateRange(validStart, invalidEnd);
          expect(result.isValid).toBe(false);
          expect(result.errors.endDate).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 2.5, 2.6, 2.7 (positive case)
   * Khoảng hợp lệ (1–31 ngày, cả hai ngày hợp lệ) → isValid: true
   */
  it('P6e: khoảng hợp lệ (1–31 ngày) luôn trả về isValid: true', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 0, max: 30 }),
        (startStr, offsetDays) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays);
          const endStr = toDateStr(end);

          const result = validateDateRange(startStr, endStr);
          expect(result.isValid).toBe(true);
          expect(result.errors).toEqual({});
        }
      ),
      { numRuns: 100 }
    );
  });
});
