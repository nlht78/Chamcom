// Feature: cham-com-theo-khoang-ngay, Property 3: Số bản ghi đồng nhất = thành viên có bữa ăn × số ngày
// Validates: Requirements 4.4, 4.5, 7.2

import * as fc from 'fast-check';
import { buildUniformRecords } from '../lib/uniformRecords';
import { generateDateRange } from '../lib/dateRangeUtils';

interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

// Arbitrary: sinh một MemberMeals ngẫu nhiên
const memberMealsArb = fc.record({
  breakfast: fc.boolean(),
  lunch: fc.boolean(),
  dinner: fc.boolean(),
});

// Arbitrary: sinh khoảng ngày hợp lệ (startDate ≤ endDate, tối đa 31 ngày)
const validDateRangeArb = fc
  .date({ min: new Date('2020-01-01'), max: new Date('2030-12-01') })
  .chain((startD) => {
    const offsetArb = fc.integer({ min: 0, max: 30 });
    return offsetArb.map((offset) => {
      const endD = new Date(startD);
      endD.setUTCDate(endD.getUTCDate() + offset);
      return {
        startDate: startD.toISOString().slice(0, 10),
        endDate: endD.toISOString().slice(0, 10),
      };
    });
  });

// Arbitrary: sinh danh sách thành viên (1–10 tên duy nhất)
const membersArb = fc
  .uniqueArray(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 10 });

describe('buildUniformRecords — Property 3: Số bản ghi đồng nhất = thành viên có bữa ăn × số ngày', () => {
  it('số bản ghi = số thành viên có ít nhất một bữa ăn × số ngày trong khoảng', () => {
    fc.assert(
      fc.property(membersArb, validDateRangeArb, (members, { startDate, endDate }) => {
        // Sinh uniformMeals cho từng thành viên
        const uniformMeals: Record<string, MemberMeals> = {};
        // Dùng deterministic assignment dựa trên index để tránh phụ thuộc random trong property
        members.forEach((name, i) => {
          uniformMeals[name] = {
            breakfast: i % 3 === 0,
            lunch: i % 2 === 0,
            dinner: i % 5 === 0,
          };
        });

        const prices = { breakfastPrice: 12000, lunchPrice: 30000, dinnerPrice: 30000 };
        const records = buildUniformRecords(members, uniformMeals, startDate, endDate, prices);

        const membersWithMeals = members.filter(
          (name) =>
            uniformMeals[name]?.breakfast ||
            uniformMeals[name]?.lunch ||
            uniformMeals[name]?.dinner
        );
        const dates = generateDateRange(startDate, endDate);
        const expectedCount = membersWithMeals.length * dates.length;

        return records.length === expectedCount;
      }),
      { numRuns: 100 }
    );
  });

  it('số bản ghi = 0 khi không có thành viên nào có bữa ăn', () => {
    fc.assert(
      fc.property(membersArb, validDateRangeArb, (members, { startDate, endDate }) => {
        const uniformMeals: Record<string, MemberMeals> = {};
        members.forEach((name) => {
          uniformMeals[name] = { breakfast: false, lunch: false, dinner: false };
        });

        const prices = { breakfastPrice: 12000, lunchPrice: 30000, dinnerPrice: 30000 };
        const records = buildUniformRecords(members, uniformMeals, startDate, endDate, prices);

        return records.length === 0;
      }),
      { numRuns: 100 }
    );
  });

  it('mỗi bản ghi có isHoliday = false', () => {
    fc.assert(
      fc.property(membersArb, validDateRangeArb, (members, { startDate, endDate }) => {
        const uniformMeals: Record<string, MemberMeals> = {};
        members.forEach((name) => {
          uniformMeals[name] = { breakfast: true, lunch: true, dinner: false };
        });

        const prices = { breakfastPrice: 12000, lunchPrice: 30000, dinnerPrice: 30000 };
        const records = buildUniformRecords(members, uniformMeals, startDate, endDate, prices);

        return records.every((r) => r.isHoliday === false);
      }),
      { numRuns: 100 }
    );
  });

  it('sinh ngẫu nhiên uniformMeals với fast-check — số bản ghi đúng', () => {
    fc.assert(
      fc.property(
        membersArb,
        validDateRangeArb,
        fc.array(memberMealsArb, { minLength: 1, maxLength: 10 }),
        (members, { startDate, endDate }, mealsList) => {
          const uniformMeals: Record<string, MemberMeals> = {};
          members.forEach((name, i) => {
            uniformMeals[name] = mealsList[i % mealsList.length];
          });

          const prices = { breakfastPrice: 12000, lunchPrice: 30000, dinnerPrice: 30000 };
          const records = buildUniformRecords(members, uniformMeals, startDate, endDate, prices);

          const membersWithMeals = members.filter(
            (name) =>
              uniformMeals[name]?.breakfast ||
              uniformMeals[name]?.lunch ||
              uniformMeals[name]?.dinner
          );
          const dates = generateDateRange(startDate, endDate);
          const expectedCount = membersWithMeals.length * dates.length;

          return records.length === expectedCount;
        }
      ),
      { numRuns: 100 }
    );
  });
});
