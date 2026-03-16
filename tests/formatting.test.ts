import { formatCurrency, formatDateToDDMMYYYY, formatDateToYYYYMMDD } from '../lib/formatting';

describe('formatCurrency', () => {
  // Test các ví dụ từ requirements
  it('should format 72000 as "72.000đ"', () => {
    expect(formatCurrency(72000)).toBe('72.000đ');
  });

  it('should format 58000 as "58.000đ"', () => {
    expect(formatCurrency(58000)).toBe('58.000đ');
  });

  it('should format 84000 as "84.000đ"', () => {
    expect(formatCurrency(84000)).toBe('84.000đ');
  });

  // Test trường hợp biên
  it('should format 0 as "0đ"', () => {
    expect(formatCurrency(0)).toBe('0đ');
  });

  it('should format single digit as "1đ"', () => {
    expect(formatCurrency(1)).toBe('1đ');
  });

  it('should format hundreds without separator as "999đ"', () => {
    expect(formatCurrency(999)).toBe('999đ');
  });

  it('should format thousands with separator as "1.000đ"', () => {
    expect(formatCurrency(1000)).toBe('1.000đ');
  });

  it('should format large numbers with multiple separators as "1.234.567đ"', () => {
    expect(formatCurrency(1234567)).toBe('1.234.567đ');
  });

  it('should format 12000 as "12.000đ"', () => {
    expect(formatCurrency(12000)).toBe('12.000đ');
  });

  it('should format 30000 as "30.000đ"', () => {
    expect(formatCurrency(30000)).toBe('30.000đ');
  });
});

describe('formatDateToDDMMYYYY', () => {
  // Test các ví dụ từ requirements
  it('should convert "2026-03-13" to "13/03/2026"', () => {
    expect(formatDateToDDMMYYYY('2026-03-13')).toBe('13/03/2026');
  });

  it('should convert "2026-04-30" to "30/04/2026"', () => {
    expect(formatDateToDDMMYYYY('2026-04-30')).toBe('30/04/2026');
  });

  // Test trường hợp biên
  it('should handle first day of month "2026-01-01"', () => {
    expect(formatDateToDDMMYYYY('2026-01-01')).toBe('01/01/2026');
  });

  it('should handle last day of month "2026-12-31"', () => {
    expect(formatDateToDDMMYYYY('2026-12-31')).toBe('31/12/2026');
  });

  it('should handle leap year date "2024-02-29"', () => {
    expect(formatDateToDDMMYYYY('2024-02-29')).toBe('29/02/2024');
  });

  it('should handle single digit month and day with leading zeros', () => {
    expect(formatDateToDDMMYYYY('2026-05-07')).toBe('07/05/2026');
  });
});

describe('formatDateToYYYYMMDD', () => {
  // Test chuyển đổi ngược lại
  it('should convert "13/03/2026" to "2026-03-13"', () => {
    expect(formatDateToYYYYMMDD('13/03/2026')).toBe('2026-03-13');
  });

  it('should convert "30/04/2026" to "2026-04-30"', () => {
    expect(formatDateToYYYYMMDD('30/04/2026')).toBe('2026-04-30');
  });

  // Test trường hợp biên
  it('should handle first day of year "01/01/2026"', () => {
    expect(formatDateToYYYYMMDD('01/01/2026')).toBe('2026-01-01');
  });

  it('should handle last day of year "31/12/2026"', () => {
    expect(formatDateToYYYYMMDD('31/12/2026')).toBe('2026-12-31');
  });

  it('should handle leap year date "29/02/2024"', () => {
    expect(formatDateToYYYYMMDD('29/02/2024')).toBe('2024-02-29');
  });

  it('should maintain leading zeros in conversion', () => {
    expect(formatDateToYYYYMMDD('07/05/2026')).toBe('2026-05-07');
  });
});

describe('formatDateToDDMMYYYY and formatDateToYYYYMMDD round-trip', () => {
  it('should convert back and forth without data loss', () => {
    const original = '2026-03-13';
    const converted = formatDateToDDMMYYYY(original);
    const backToOriginal = formatDateToYYYYMMDD(converted);
    expect(backToOriginal).toBe(original);
  });

  it('should handle round-trip for various dates', () => {
    const dates = ['2026-01-01', '2026-06-15', '2026-12-31'];
    dates.forEach(date => {
      const converted = formatDateToDDMMYYYY(date);
      const backToOriginal = formatDateToYYYYMMDD(converted);
      expect(backToOriginal).toBe(date);
    });
  });
});
