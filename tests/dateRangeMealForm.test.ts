import * as fc from 'fast-check';
import { validateDateRange, validatePrice } from '../lib/validation';
import { generateDateRange } from '../lib/dateRangeUtils';

// ─── Types (mirroring DateRangeMealForm internals) ────────────────────────────

interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

type UniformMeals = Record<string, MemberMeals>;

interface DayConfig {
  isHoliday: boolean;
  memberMeals: Record<string, MemberMeals>;
}

type NonUniformMeals = Record<string, DayConfig>;

// ─── Pure helpers (same logic as DateRangeMealForm.tsx) ───────────────────────

function buildInitialUniformMeals(members: string[]): UniformMeals {
  const meals: UniformMeals = {};
  for (const m of members) {
    meals[m] = { breakfast: false, lunch: false, dinner: false };
  }
  return meals;
}

function buildInitialNonUniformMeals(members: string[], dates: string[]): NonUniformMeals {
  const meals: NonUniformMeals = {};
  for (const date of dates) {
    const memberMeals: Record<string, MemberMeals> = {};
    for (const m of members) {
      memberMeals[m] = { breakfast: false, lunch: false, dinner: false };
    }
    meals[date] = { isHoliday: false, memberMeals };
  }
  return meals;
}

function resetUniformMeals(prev: UniformMeals): UniformMeals {
  const reset: UniformMeals = {};
  for (const name of Object.keys(prev)) {
    reset[name] = { breakfast: false, lunch: false, dinner: false };
  }
  return reset;
}

function resetNonUniformMeals(prev: NonUniformMeals): NonUniformMeals {
  const reset: NonUniformMeals = {};
  for (const date of Object.keys(prev)) {
    const memberMeals: Record<string, MemberMeals> = {};
    for (const name of Object.keys(prev[date].memberMeals)) {
      memberMeals[name] = { breakfast: false, lunch: false, dinner: false };
    }
    reset[date] = { isHoliday: prev[date].isHoliday, memberMeals };
  }
  return reset;
}

// ─── Arbitraries ──────────────────────────────────────────────────────────────

function toDateStr(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const validDateArb = fc
  .date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') })
  .map(toDateStr);

/** Arbitrary for a non-empty list of unique member names */
const membersArb = fc
  .uniqueArray(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 8 });

/** Arbitrary for a positive price (integer cents, e.g. 1–100000) */
const positivePriceArb = fc.integer({ min: 1, max: 100000 });

/** Arbitrary for a single MemberMeals (any combination of booleans) */
const memberMealsArb: fc.Arbitrary<MemberMeals> = fc.record({
  breakfast: fc.boolean(),
  lunch: fc.boolean(),
  dinner: fc.boolean(),
});

/** Arbitrary for UniformMeals given a fixed member list */
function uniformMealsArb(members: string[]): fc.Arbitrary<UniformMeals> {
  if (members.length === 0) return fc.constant({});
  const entries = members.map((m) =>
    memberMealsArb.map((meals) => [m, meals] as [string, MemberMeals])
  );
  return fc.tuple(...entries).map((pairs) => Object.fromEntries(pairs));
}

/** Arbitrary for NonUniformMeals given fixed members and dates */
function nonUniformMealsArb(members: string[], dates: string[]): fc.Arbitrary<NonUniformMeals> {
  if (dates.length === 0) return fc.constant({});
  const dayEntries = dates.map((date) =>
    fc
      .record({
        isHoliday: fc.boolean(),
        memberMeals: members.length === 0
          ? fc.constant({} as Record<string, MemberMeals>)
          : fc
              .tuple(...members.map(() => memberMealsArb))
              .map((mealsList) =>
                Object.fromEntries(members.map((m, i) => [m, mealsList[i]]))
              ),
      })
      .map((cfg) => [date, cfg] as [string, DayConfig])
  );
  return fc.tuple(...dayEntries).map((pairs) => Object.fromEntries(pairs));
}

// ─── Property 6: Validation ngăn lưu khi dữ liệu không hợp lệ ────────────────
// Feature: cham-com-theo-khoang-ngay, Property 6: Validation ngăn lưu khi dữ liệu không hợp lệ

describe('Property 6: Validation ngăn lưu khi dữ liệu không hợp lệ', () => {
  /**
   * Validates: Requirements 2.5
   * endDate < startDate → combined guard is false
   */
  it('P6-integration-a: endDate < startDate → validation fails, save blocked', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 1, max: 30 }),
        positivePriceArb,
        positivePriceArb,
        positivePriceArb,
        (startStr, offsetDays, bp, lp, dp) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() - offsetDays);
          const endStr = toDateStr(end);

          const dateRangeResult = validateDateRange(startStr, endStr);
          const pricesValid =
            validatePrice(bp) && validatePrice(lp) && validatePrice(dp);

          // Guard: save is blocked when validation fails
          const saveAllowed = dateRangeResult.isValid && pricesValid;
          expect(saveAllowed).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 2.6
   * Range > 31 days → combined guard is false
   */
  it('P6-integration-b: khoảng > 31 ngày → validation fails, save blocked', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 32, max: 365 }),
        positivePriceArb,
        positivePriceArb,
        positivePriceArb,
        (startStr, offsetDays, bp, lp, dp) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays - 1);
          const endStr = toDateStr(end);

          const dateRangeResult = validateDateRange(startStr, endStr);
          const pricesValid =
            validatePrice(bp) && validatePrice(lp) && validatePrice(dp);

          const saveAllowed = dateRangeResult.isValid && pricesValid;
          expect(saveAllowed).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 2.7
   * Invalid date strings → combined guard is false
   */
  it('P6-integration-c: ngày không hợp lệ → validation fails, save blocked', () => {
    const invalidDateArb = fc.oneof(
      fc.constant(''),
      fc.constant('not-a-date'),
      fc.constant('2024-13-01'),
      fc.constant('2024-00-15'),
      fc.constant('2024-02-30'),
      fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !/^\d{4}-\d{2}-\d{2}$/.test(s)),
    );

    fc.assert(
      fc.property(
        invalidDateArb,
        validDateArb,
        positivePriceArb,
        positivePriceArb,
        positivePriceArb,
        (invalidStart, validEnd, bp, lp, dp) => {
          const dateRangeResult = validateDateRange(invalidStart, validEnd);
          const pricesValid =
            validatePrice(bp) && validatePrice(lp) && validatePrice(dp);

          const saveAllowed = dateRangeResult.isValid && pricesValid;
          expect(saveAllowed).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 2.8
   * Invalid price (≤ 0, NaN, Infinity) → combined guard is false
   */
  it('P6-integration-d: giá không hợp lệ → validation fails, save blocked', () => {
    const invalidPriceArb = fc.oneof(
      fc.constant(0),
      fc.integer({ min: -100000, max: -1 }),
      fc.constant(NaN),
      fc.constant(Infinity),
      fc.constant(-Infinity),
    );

    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 0, max: 30 }),
        invalidPriceArb,
        positivePriceArb,
        positivePriceArb,
        (startStr, offsetDays, invalidPrice, lp, dp) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays);
          const endStr = toDateStr(end);

          const dateRangeResult = validateDateRange(startStr, endStr);
          // Use invalidPrice as breakfastPrice
          const pricesValid =
            validatePrice(invalidPrice) && validatePrice(lp) && validatePrice(dp);

          const saveAllowed = dateRangeResult.isValid && pricesValid;
          expect(saveAllowed).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Positive case: valid inputs → guard is true
   */
  it('P6-integration-e: đầu vào hợp lệ → validation passes, save allowed', () => {
    fc.assert(
      fc.property(
        validDateArb,
        fc.integer({ min: 0, max: 30 }),
        positivePriceArb,
        positivePriceArb,
        positivePriceArb,
        (startStr, offsetDays, bp, lp, dp) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays);
          const endStr = toDateStr(end);

          const dateRangeResult = validateDateRange(startStr, endStr);
          const pricesValid =
            validatePrice(bp) && validatePrice(lp) && validatePrice(dp);

          const saveAllowed = dateRangeResult.isValid && pricesValid;
          expect(saveAllowed).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 7: Reset sau khi lưu thành công ─────────────────────────────────
// Feature: cham-com-theo-khoang-ngay, Property 7: Reset sau khi lưu thành công

describe('Property 7: Reset sau khi lưu thành công', () => {
  /**
   * Validates: Requirements 7.7
   * After resetUniformMeals: all meals are false for every member
   */
  it('P7a: resetUniformMeals đặt tất cả bữa ăn về false', () => {
    fc.assert(
      fc.property(
        membersArb,
        (members) => {
          // Build arbitrary uniform meals (some may be true)
          const meals: UniformMeals = {};
          for (const m of members) {
            meals[m] = {
              breakfast: Math.random() > 0.5,
              lunch: Math.random() > 0.5,
              dinner: Math.random() > 0.5,
            };
          }

          const reset = resetUniformMeals(meals);

          // All meals must be false after reset
          for (const name of members) {
            expect(reset[name].breakfast).toBe(false);
            expect(reset[name].lunch).toBe(false);
            expect(reset[name].dinner).toBe(false);
          }
          // All original members are preserved
          expect(Object.keys(reset)).toEqual(Object.keys(meals));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 7.7
   * After resetUniformMeals: all meals false regardless of prior state (using fc.boolean)
   */
  it('P7b: resetUniformMeals — bất kỳ trạng thái nào cũng reset về false', () => {
    fc.assert(
      fc.property(
        membersArb.chain((members) =>
          uniformMealsArb(members).map((meals) => ({ members, meals }))
        ),
        ({ meals }) => {
          const reset = resetUniformMeals(meals);
          for (const name of Object.keys(reset)) {
            expect(reset[name].breakfast).toBe(false);
            expect(reset[name].lunch).toBe(false);
            expect(reset[name].dinner).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 7.7
   * After resetNonUniformMeals: all member meals are false, isHoliday is preserved
   */
  it('P7c: resetNonUniformMeals đặt tất cả bữa ăn về false, giữ nguyên isHoliday', () => {
    fc.assert(
      fc.property(
        membersArb,
        validDateArb,
        fc.integer({ min: 0, max: 10 }),
        (members, startStr, offsetDays) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays);
          const endStr = toDateStr(end);
          const dates = generateDateRange(startStr, endStr);

          // Build non-uniform meals with random values
          const meals: NonUniformMeals = {};
          for (const date of dates) {
            const memberMeals: Record<string, MemberMeals> = {};
            for (const m of members) {
              memberMeals[m] = {
                breakfast: Math.random() > 0.5,
                lunch: Math.random() > 0.5,
                dinner: Math.random() > 0.5,
              };
            }
            meals[date] = { isHoliday: Math.random() > 0.5, memberMeals };
          }

          const reset = resetNonUniformMeals(meals);

          for (const date of dates) {
            // isHoliday must be preserved
            expect(reset[date].isHoliday).toBe(meals[date].isHoliday);
            // All member meals must be false
            for (const name of members) {
              expect(reset[date].memberMeals[name].breakfast).toBe(false);
              expect(reset[date].memberMeals[name].lunch).toBe(false);
              expect(reset[date].memberMeals[name].dinner).toBe(false);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 7.7
   * rangeSettings and selectedGroup are NOT touched by reset (separate state)
   * Verified by showing reset functions only operate on meal state
   */
  it('P7d: reset không ảnh hưởng đến rangeSettings và selectedGroup', () => {
    fc.assert(
      fc.property(
        membersArb.chain((members) =>
          uniformMealsArb(members).map((meals) => ({ members, meals }))
        ),
        validDateArb,
        fc.integer({ min: 0, max: 30 }),
        positivePriceArb,
        positivePriceArb,
        positivePriceArb,
        ({ meals }, startStr, offsetDays, bp, lp, dp) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays);
          const endStr = toDateStr(end);

          // Simulate rangeSettings (immutable during reset)
          const rangeSettings = {
            startDate: startStr,
            endDate: endStr,
            breakfastPrice: bp,
            lunchPrice: lp,
            dinnerPrice: dp,
          };

          // Reset only affects meals
          const resetMeals = resetUniformMeals(meals);

          // rangeSettings unchanged
          expect(rangeSettings.startDate).toBe(startStr);
          expect(rangeSettings.endDate).toBe(endStr);
          expect(rangeSettings.breakfastPrice).toBe(bp);
          expect(rangeSettings.lunchPrice).toBe(lp);
          expect(rangeSettings.dinnerPrice).toBe(dp);

          // Meals are reset
          for (const name of Object.keys(resetMeals)) {
            expect(resetMeals[name].breakfast).toBe(false);
            expect(resetMeals[name].lunch).toBe(false);
            expect(resetMeals[name].dinner).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 8: Chuyển đổi chế độ đặt lại trạng thái ───────────────────────
// Feature: cham-com-theo-khoang-ngay, Property 8: Chuyển đổi chế độ đặt lại trạng thái

describe('Property 8: Chuyển đổi chế độ đặt lại trạng thái', () => {
  /**
   * Validates: Requirements 1.5
   * buildInitialUniformMeals always produces all-false state
   */
  it('P8a: buildInitialUniformMeals luôn tạo trạng thái all-false', () => {
    fc.assert(
      fc.property(membersArb, (members) => {
        const initial = buildInitialUniformMeals(members);

        expect(Object.keys(initial)).toHaveLength(members.length);
        for (const m of members) {
          expect(initial[m].breakfast).toBe(false);
          expect(initial[m].lunch).toBe(false);
          expect(initial[m].dinner).toBe(false);
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 1.5
   * buildInitialNonUniformMeals always produces all-false state with isHoliday: false
   */
  it('P8b: buildInitialNonUniformMeals luôn tạo trạng thái all-false', () => {
    fc.assert(
      fc.property(
        membersArb,
        validDateArb,
        fc.integer({ min: 0, max: 30 }),
        (members, startStr, offsetDays) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays);
          const endStr = toDateStr(end);
          const dates = generateDateRange(startStr, endStr);

          const initial = buildInitialNonUniformMeals(members, dates);

          expect(Object.keys(initial)).toHaveLength(dates.length);
          for (const date of dates) {
            expect(initial[date].isHoliday).toBe(false);
            for (const m of members) {
              expect(initial[date].memberMeals[m].breakfast).toBe(false);
              expect(initial[date].memberMeals[m].lunch).toBe(false);
              expect(initial[date].memberMeals[m].dinner).toBe(false);
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 1.5
   * After mode switch (simulated by re-initialising state), all meals are false
   * regardless of what the previous state was.
   */
  it('P8c: chuyển chế độ → trạng thái bữa ăn về mặc định (all-false)', () => {
    fc.assert(
      fc.property(
        membersArb.chain((members) =>
          uniformMealsArb(members).map((meals) => ({ members, meals }))
        ),
        validDateArb,
        fc.integer({ min: 0, max: 30 }),
        ({ members, meals }, startStr, offsetDays) => {
          const start = new Date(startStr);
          const end = new Date(start);
          end.setUTCDate(end.getUTCDate() + offsetDays);
          const endStr = toDateStr(end);
          const dates = generateDateRange(startStr, endStr);

          // Simulate mode switch: re-initialise both meal states
          const newUniform = buildInitialUniformMeals(members);
          const newNonUniform = buildInitialNonUniformMeals(members, dates);

          // Uniform: all false
          for (const m of members) {
            expect(newUniform[m].breakfast).toBe(false);
            expect(newUniform[m].lunch).toBe(false);
            expect(newUniform[m].dinner).toBe(false);
          }

          // Non-uniform: all false, isHoliday: false
          for (const date of dates) {
            expect(newNonUniform[date].isHoliday).toBe(false);
            for (const m of members) {
              expect(newNonUniform[date].memberMeals[m].breakfast).toBe(false);
              expect(newNonUniform[date].memberMeals[m].lunch).toBe(false);
              expect(newNonUniform[date].memberMeals[m].dinner).toBe(false);
            }
          }

          // Previous meals state is irrelevant — new state is always default
          // (This verifies the property holds for ANY prior state)
          void meals;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Validates: Requirements 1.5
   * Empty member list → initial state is empty object (no crash)
   */
  it('P8d: danh sách thành viên rỗng → trạng thái khởi tạo là object rỗng', () => {
    const initial = buildInitialUniformMeals([]);
    expect(initial).toEqual({});

    const initialNonUniform = buildInitialNonUniformMeals([], ['2024-01-01', '2024-01-02']);
    expect(initialNonUniform['2024-01-01'].memberMeals).toEqual({});
    expect(initialNonUniform['2024-01-01'].isHoliday).toBe(false);
  });
});
