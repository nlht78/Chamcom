import * as fc from 'fast-check';
import { generateDateRange, countDaysInRange } from '../lib/dateRangeUtils';

// ─── Unit Tests ───────────────────────────────────────────────────────────────

describe('generateDateRange — unit tests', () => {
  it('returns a single-element array when startDate equals endDate', () => {
    expect(generateDateRange('2024-01-01', '2024-01-01')).toEqual(['2024-01-01']);
  });

  it('returns consecutive days from startDate to endDate inclusive', () => {
    expect(generateDateRange('2024-01-01', '2024-01-03')).toEqual([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
    ]);
  });

  it('returns empty array when startDate is after endDate', () => {
    expect(generateDateRange('2024-01-03', '2024-01-01')).toEqual([]);
  });

  it('handles month boundaries correctly', () => {
    const result = generateDateRange('2024-01-30', '2024-02-02');
    expect(result).toEqual(['2024-01-30', '2024-01-31', '2024-02-01', '2024-02-02']);
  });

  it('handles year boundaries correctly', () => {
    const result = generateDateRange('2023-12-30', '2024-01-02');
    expect(result).toEqual(['2023-12-30', '2023-12-31', '2024-01-01', '2024-01-02']);
  });

  it('handles leap year February correctly', () => {
    const result = generateDateRange('2024-02-28', '2024-03-01');
    expect(result).toEqual(['2024-02-28', '2024-02-29', '2024-03-01']);
  });
});

// Feature: cham-com-theo-khoang-ngay, Property 2: generateDateRange — edge cases
describe('generateDateRange — Property 2: edge cases', () => {
  // Validates: Requirements 8.2, 8.5

  it('startDate = endDate → exactly one element', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2030-12-31') }),
        (d) => {
          const dateStr = d.toISOString().slice(0, 10);
          const result = generateDateRange(dateStr, dateStr);
          return result.length === 1 && result[0] === dateStr;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('startDate > endDate → empty array', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-02'), max: new Date('2030-12-31') }),
        fc.integer({ min: 1, max: 365 }),
        (endD, offsetDays) => {
          // Build a startDate that is strictly after endDate (by date string)
          const startD = new Date(endD);
          startD.setUTCDate(startD.getUTCDate() + offsetDays);
          const start = startD.toISOString().slice(0, 10);
          const end = endD.toISOString().slice(0, 10);
          // start > end by construction
          return generateDateRange(start, end).length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: cham-com-theo-khoang-ngay, Property 1: generateDateRange trả về mảng ngày liên tiếp đúng thứ tự
describe('generateDateRange — Property 1: consecutive dates in ascending order', () => {
  // Validates: Requirements 8.1, 8.3, 8.4, 7.1

  it('result includes startDate and endDate, is sorted ascending, consecutive by 1 day, length = day count', () => {
    fc.assert(
      fc.property(
        // Generate a start date and a non-negative offset (0–364 days)
        fc.date({ min: new Date('2000-01-01'), max: new Date('2029-12-31') }),
        fc.integer({ min: 0, max: 364 }),
        (startD, offsetDays) => {
          const startStr = startD.toISOString().slice(0, 10);
          const endD = new Date(startD);
          endD.setUTCDate(endD.getUTCDate() + offsetDays);
          const endStr = endD.toISOString().slice(0, 10);

          const result = generateDateRange(startStr, endStr);

          // Length must equal offsetDays + 1
          if (result.length !== offsetDays + 1) return false;

          // First element is startDate, last is endDate
          if (result[0] !== startStr) return false;
          if (result[result.length - 1] !== endStr) return false;

          // Each consecutive pair differs by exactly 1 day and is ascending
          for (let i = 1; i < result.length; i++) {
            const prev = new Date(result[i - 1]);
            const curr = new Date(result[i]);
            const diffMs = curr.getTime() - prev.getTime();
            const diffDays = diffMs / (1000 * 60 * 60 * 24);
            if (diffDays !== 1) return false;
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── countDaysInRange ─────────────────────────────────────────────────────────

describe('countDaysInRange', () => {
  it('returns 1 when startDate equals endDate', () => {
    expect(countDaysInRange('2024-06-15', '2024-06-15')).toBe(1);
  });

  it('returns correct count for a range', () => {
    expect(countDaysInRange('2024-01-01', '2024-01-31')).toBe(31);
  });

  it('returns 0 when startDate is after endDate', () => {
    expect(countDaysInRange('2024-01-10', '2024-01-05')).toBe(0);
  });

  it('matches generateDateRange length', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2029-12-31') }),
        fc.integer({ min: 0, max: 100 }),
        (startD, offset) => {
          const startStr = startD.toISOString().slice(0, 10);
          const endD = new Date(startD);
          endD.setUTCDate(endD.getUTCDate() + offset);
          const endStr = endD.toISOString().slice(0, 10);
          return countDaysInRange(startStr, endStr) === generateDateRange(startStr, endStr).length;
        }
      ),
      { numRuns: 100 }
    );
  });
});
