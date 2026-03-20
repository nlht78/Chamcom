interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface DayConfig {
  isHoliday: boolean;
  memberMeals: Record<string, MemberMeals>;
}

type NonUniformMeals = Record<string, DayConfig>; // key = YYYY-MM-DD

interface NonUniformRecordPrices {
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
}

interface NonUniformRecord {
  date: string;
  employeeName: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  isHoliday: boolean;
}

/**
 * Tạo danh sách bản ghi cho chế độ không đồng nhất.
 * Mỗi cặp (thành viên có ít nhất một bữa ăn, ngày) tạo ra một bản ghi,
 * với isHoliday lấy từ DayConfig của ngày tương ứng.
 *
 * Property 4: records.length === sum over dates of (members with meals for that date)
 * Property 5: each record.isHoliday === nonUniformMeals[record.date].isHoliday
 */
export function buildNonUniformRecords(
  members: string[],
  nonUniformMeals: NonUniformMeals,
  dates: string[],
  prices: NonUniformRecordPrices
): NonUniformRecord[] {
  const records: NonUniformRecord[] = [];

  for (const date of dates) {
    const dayConfig = nonUniformMeals[date] ?? { isHoliday: false, memberMeals: {} };

    for (const name of members) {
      const meals = dayConfig.memberMeals[name];
      if (!meals?.breakfast && !meals?.lunch && !meals?.dinner) continue;

      records.push({
        date,
        employeeName: name,
        breakfast: meals.breakfast,
        lunch: meals.lunch,
        dinner: meals.dinner,
        breakfastPrice: prices.breakfastPrice,
        lunchPrice: prices.lunchPrice,
        dinnerPrice: prices.dinnerPrice,
        isHoliday: dayConfig.isHoliday,
      });
    }
  }

  return records;
}
