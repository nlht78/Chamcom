import { 
  validateEmployeeName, 
  validateDate, 
  validatePrice, 
  validateForm,
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
