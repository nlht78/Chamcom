// Feature: cham-com-theo-khoang-ngay, Property 4: Số bản ghi không đồng nhất = tổng cặp (thành viên có bữa ăn, ngày)
// Feature: cham-com-theo-khoang-ngay, Property 5: Hệ số ngày lễ per-day trong chế độ không đồng nhất
// Validates: Requirements 5.5, 7.3, 5.3, 5.6

import * as fc from 'fast-check';
import { buildNonUniformRecords } from '../lib/nonUniformRecords';

interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface DayConfig {
  isHoliday: boolean;
  memberMeals: Record<string, MemberMeals>;
}

type NonUniformMeals = Record<string, DayConfig>;

const prices = { breakfastPrice: 12000, lunchPrice: 30000, dinnerPrice: 30000 };

// Arbitrary: sinh một MemberMeals ngẫu nhiên
const memberMealsArb = fc.record({
  breakfast: fc.boolean(),
  lunch: fc.boolean(),
  dinner: fc.boolean(),
});

// Arbitrary: sinh danh sách thành viên (1–8 tên duy nhất)
const membersArb = fc.uniqueArray(
  fc.string({ minLength: 1, maxLength: 10 }),
  { minLength: 1, maxLength: 8 }
);

// Arbitrary: sinh khoảng ngày hợp lệ (startDate ≤ endDate, tối đa 31 ngày)
const validDateRangeArb = fc
  .date({ min: new Date('2020-01-01'), max: new Date('2030-12-01') })
  .chain((startD) =>
    fc.integer({ min: 0, max: 30 }).map((offset) => {
      const endD = new Date(startD);
      endD.setUTCDate(endD.getUTCDate() + offset);
      const toYMD = (d: Date) => d.toISOString().slice(0, 10);
      // Generate all dates in range
      const dates: string[] = [];
      const cur = new Date(startD);
      while (cur <= endD) {
        dates.push(toYMD(cur));
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
      return dates;
    })
  );

// Arbitrary: sinh NonUniformMeals cho một danh sách ngày và thành viên
function nonUniformMealsArb(dates: string[], members: string[]) {
  if (dates.length === 0 || members.length === 0) {
    return fc.constant({} as NonUniformMeals);
  }
  const dayConfigArb = fc.record({
    isHoliday: fc.boolean(),
    memberMeals: fc.record(
      Object.fromEntries(members.map((m) => [m, memberMealsArb]))
    ) as fc.Arbitrary<Record<string, MemberMeals>>,
  });

  return fc.record(
    Object.fromEntries(dates.map((d) => [d, dayConfigArb]))
  ) as fc.Arbitrary<NonUniformMeals>;
}

describe('buildNonUniformRecords — Property 4: Số bản ghi không đồng nhất = tổng cặp (thành viên có bữa ăn, ngày)', () => {
  it('số bản ghi = tổng số cặp (thành viên có ít nhất một bữa ăn, ngày) trên tất cả các ngày', () => {
    fc.assert(
      fc.property(membersArb, validDateRangeArb, (members, dates) => {
        return fc.pre(dates.length > 0) as unknown as boolean || (() => {
          // Build nonUniformMeals deterministically
          const nonUniformMeals: NonUniformMeals = {};
          dates.forEach((date, di) => {
            nonUniformMeals[date] = {
              isHoliday: di % 3 === 0,
              memberMeals: Object.fromEntries(
                members.map((name, mi) => [
                  name,
                  {
                    breakfast: (di + mi) % 3 === 0,
                    lunch: (di + mi) % 2 === 0,
                    dinner: (di + mi) % 5 === 0,
                  },
                ])
              ),
            };
          });

          const records = buildNonUniformRecords(members, nonUniformMeals, dates, prices);

          const expectedCount = dates.reduce((total, date) => {
            const dayConfig = nonUniformMeals[date];
            if (!dayConfig) return total;
            const membersWithMeals = members.filter(
              (name) =>
                dayConfig.memberMeals[name]?.breakfast ||
                dayConfig.memberMeals[name]?.lunch ||
                dayConfig.memberMeals[name]?.dinner
            );
            return total + membersWithMeals.length;
          }, 0);

          return records.length === expectedCount;
        })();
      }),
      { numRuns: 100 }
    );
  });

  it('sinh ngẫu nhiên nonUniformMeals — số bản ghi đúng', () => {
    fc.assert(
      fc.property(membersArb, validDateRangeArb, (members, dates) => {
        fc.pre(dates.length > 0);

        // Build nonUniformMeals with fast-check inline
        const nonUniformMeals: NonUniformMeals = {};
        dates.forEach((date, di) => {
          nonUniformMeals[date] = {
            isHoliday: di % 2 === 0,
            memberMeals: Object.fromEntries(
              members.map((name, mi) => [
                name,
                {
                  breakfast: (di * members.length + mi) % 4 !== 0,
                  lunch: (di * members.length + mi) % 3 !== 0,
                  dinner: (di * members.length + mi) % 7 !== 0,
                },
              ])
            ),
          };
        });

        const records = buildNonUniformRecords(members, nonUniformMeals, dates, prices);

        const expectedCount = dates.reduce((total, date) => {
          const dayConfig = nonUniformMeals[date];
          if (!dayConfig) return total;
          const count = members.filter(
            (name) =>
              dayConfig.memberMeals[name]?.breakfast ||
              dayConfig.memberMeals[name]?.lunch ||
              dayConfig.memberMeals[name]?.dinner
          ).length;
          return total + count;
        }, 0);

        return records.length === expectedCount;
      }),
      { numRuns: 100 }
    );
  });

  it('số bản ghi = 0 khi không có thành viên nào có bữa ăn', () => {
    fc.assert(
      fc.property(membersArb, validDateRangeArb, (members, dates) => {
        fc.pre(dates.length > 0);

        const nonUniformMeals: NonUniformMeals = {};
        dates.forEach((date) => {
          nonUniformMeals[date] = {
            isHoliday: false,
            memberMeals: Object.fromEntries(
              members.map((name) => [name, { breakfast: false, lunch: false, dinner: false }])
            ),
          };
        });

        const records = buildNonUniformRecords(members, nonUniformMeals, dates, prices);
        return records.length === 0;
      }),
      { numRuns: 100 }
    );
  });
});

describe('buildNonUniformRecords — Property 5: Hệ số ngày lễ per-day trong chế độ không đồng nhất', () => {
  it('mỗi bản ghi có isHoliday khớp với DayConfig của ngày tương ứng', () => {
    fc.assert(
      fc.property(membersArb, validDateRangeArb, (members, dates) => {
        fc.pre(dates.length > 0);

        // Sinh nonUniformMeals với isHoliday ngẫu nhiên (deterministic by index)
        const nonUniformMeals: NonUniformMeals = {};
        dates.forEach((date, di) => {
          nonUniformMeals[date] = {
            isHoliday: di % 2 === 0, // alternating holiday/non-holiday
            memberMeals: Object.fromEntries(
              members.map((name) => [name, { breakfast: true, lunch: false, dinner: false }])
            ),
          };
        });

        const records = buildNonUniformRecords(members, nonUniformMeals, dates, prices);

        // Every record's isHoliday must match its day's DayConfig
        return records.every(
          (record) => record.isHoliday === nonUniformMeals[record.date].isHoliday
        );
      }),
      { numRuns: 100 }
    );
  });

  it('sinh ngẫu nhiên isHoliday — mỗi bản ghi phản ánh đúng hệ số ngày lễ của ngày đó', () => {
    fc.assert(
      fc.property(
        membersArb,
        validDateRangeArb,
        fc.array(fc.boolean(), { minLength: 1, maxLength: 31 }),
        (members, dates, holidayFlags) => {
          fc.pre(dates.length > 0);

          const nonUniformMeals: NonUniformMeals = {};
          dates.forEach((date, di) => {
            nonUniformMeals[date] = {
              isHoliday: holidayFlags[di % holidayFlags.length],
              memberMeals: Object.fromEntries(
                members.map((name, mi) => [
                  name,
                  {
                    breakfast: mi % 2 === 0,
                    lunch: mi % 3 === 0,
                    dinner: false,
                  },
                ])
              ),
            };
          });

          const records = buildNonUniformRecords(members, nonUniformMeals, dates, prices);

          return records.every(
            (record) => record.isHoliday === nonUniformMeals[record.date].isHoliday
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('ngày lễ và ngày thường trong cùng khoảng — isHoliday độc lập theo từng ngày', () => {
    fc.assert(
      fc.property(membersArb, validDateRangeArb, (members, dates) => {
        fc.pre(dates.length >= 2);

        const nonUniformMeals: NonUniformMeals = {};
        dates.forEach((date, di) => {
          nonUniformMeals[date] = {
            isHoliday: di === 0, // only first day is holiday
            memberMeals: Object.fromEntries(
              members.map((name) => [name, { breakfast: true, lunch: true, dinner: false }])
            ),
          };
        });

        const records = buildNonUniformRecords(members, nonUniformMeals, dates, prices);

        const holidayRecords = records.filter((r) => r.isHoliday);
        const normalRecords = records.filter((r) => !r.isHoliday);

        // Holiday records should only be from the first date
        const allHolidayFromFirstDate = holidayRecords.every((r) => r.date === dates[0]);
        // Normal records should not be from the first date
        const noNormalFromFirstDate = normalRecords.every((r) => r.date !== dates[0]);

        return allHolidayFromFirstDate && noNormalFromFirstDate;
      }),
      { numRuns: 100 }
    );
  });
});
