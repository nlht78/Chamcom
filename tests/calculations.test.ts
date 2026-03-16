import { calculateTotal, booleanToBinary } from '../lib/calculations';

describe('calculateTotal', () => {
  // Test các ví dụ từ requirements
  it('should calculate 72.000đ for example 1 (all meals, regular day)', () => {
    const result = calculateTotal(true, true, true, 12000, 30000, 30000, 1);
    expect(result).toBe(72000);
  });

  it('should calculate 58.000đ for example 2 (lunch and dinner with custom price)', () => {
    const result = calculateTotal(false, true, true, 12000, 30000, 28000, 1);
    expect(result).toBe(58000);
  });

  it('should calculate 84.000đ for example 3 (breakfast and lunch on holiday)', () => {
    const result = calculateTotal(true, true, false, 12000, 30000, 30000, 2);
    expect(result).toBe(84000);
  });

  // Test trường hợp biên
  it('should return 0 when no meals are selected', () => {
    const result = calculateTotal(false, false, false, 12000, 30000, 30000, 1);
    expect(result).toBe(0);
  });

  it('should return 0 when all prices are 0', () => {
    const result = calculateTotal(true, true, true, 0, 0, 0, 1);
    expect(result).toBe(0);
  });

  it('should handle only breakfast selected', () => {
    const result = calculateTotal(true, false, false, 12000, 30000, 30000, 1);
    expect(result).toBe(12000);
  });

  it('should handle only lunch selected', () => {
    const result = calculateTotal(false, true, false, 12000, 30000, 30000, 1);
    expect(result).toBe(30000);
  });

  it('should handle only dinner selected', () => {
    const result = calculateTotal(false, false, true, 12000, 30000, 30000, 1);
    expect(result).toBe(30000);
  });

  it('should apply multiplier correctly for holiday (multiplier = 2)', () => {
    const result = calculateTotal(true, false, false, 12000, 30000, 30000, 2);
    expect(result).toBe(24000);
  });
});

describe('booleanToBinary', () => {
  it('should convert true to 1', () => {
    expect(booleanToBinary(true)).toBe(1);
  });

  it('should convert false to 0', () => {
    expect(booleanToBinary(false)).toBe(0);
  });

  it('should return type 0 | 1', () => {
    const result1 = booleanToBinary(true);
    const result2 = booleanToBinary(false);
    
    expect([0, 1]).toContain(result1);
    expect([0, 1]).toContain(result2);
  });
});
