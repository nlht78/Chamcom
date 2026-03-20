import { generateDateRange } from './dateRangeUtils';

interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

type UniformMeals = Record<string, MemberMeals>;

interface UniformRecordPrices {
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
}

interface UniformRecord {
  date: string;
  employeeName: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  isHoliday: false;
}

/**
 * Tạo danh sách bản ghi cho chế độ đồng nhất.
 * Mỗi thành viên có ít nhất một bữa ăn sẽ có một bản ghi cho mỗi ngày trong khoảng.
 */
export function buildUniformRecords(
  members: string[],
  uniformMeals: UniformMeals,
  startDate: string,
  endDate: string,
  prices: UniformRecordPrices
): UniformRecord[] {
  const membersWithMeals = members.filter(
    (name) =>
      uniformMeals[name]?.breakfast ||
      uniformMeals[name]?.lunch ||
      uniformMeals[name]?.dinner
  );

  const dates = generateDateRange(startDate, endDate);
  const records: UniformRecord[] = [];

  for (const date of dates) {
    for (const name of membersWithMeals) {
      records.push({
        date,
        employeeName: name,
        breakfast: uniformMeals[name].breakfast,
        lunch: uniformMeals[name].lunch,
        dinner: uniformMeals[name].dinner,
        breakfastPrice: prices.breakfastPrice,
        lunchPrice: prices.lunchPrice,
        dinnerPrice: prices.dinnerPrice,
        isHoliday: false,
      });
    }
  }

  return records;
}
