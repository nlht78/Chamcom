'use client';

import { useState } from 'react';
import MemberTable from './MemberTable';

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

interface NonUniformModePanelProps {
  dates: string[];
  members: string[];
  nonUniformMeals: NonUniformMeals;
  prices: { breakfastPrice: number; lunchPrice: number; dinnerPrice: number };
  onDayHolidayChange: (date: string, isHoliday: boolean) => void;
  onMealChange: (date: string, member: string, meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
  onBulkChange: (date: string, meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
}

function formatDate(dateStr: string): string {
  // dateStr is YYYY-MM-DD, convert to DD/MM/YYYY
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

interface DayAccordionProps {
  date: string;
  members: string[];
  dayConfig: DayConfig;
  prices: { breakfastPrice: number; lunchPrice: number; dinnerPrice: number };
  onHolidayChange: (isHoliday: boolean) => void;
  onMealChange: (member: string, meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
  onBulkChange: (meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
}

function DayAccordion({
  date,
  members,
  dayConfig,
  prices,
  onHolidayChange,
  onMealChange,
  onBulkChange,
}: DayAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const settings = {
    date,
    breakfastPrice: prices.breakfastPrice,
    lunchPrice: prices.lunchPrice,
    dinnerPrice: prices.dinnerPrice,
    isHoliday: dayConfig.isHoliday,
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Accordion header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <button
          type="button"
          className="flex items-center gap-2 flex-1 text-left"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <span className="text-sm font-medium text-gray-700">{formatDate(date)}</span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Holiday checkbox */}
        <label className="flex items-center gap-2 text-sm text-orange-700 font-medium cursor-pointer select-none ml-4">
          <input
            type="checkbox"
            checked={dayConfig.isHoliday}
            onChange={(e) => onHolidayChange(e.target.checked)}
            className="w-4 h-4 accent-orange-500 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
          Ngày lễ (Hệ số x2)
        </label>
      </div>

      {/* Accordion body */}
      {isOpen && (
        <div className="p-4 bg-white">
          <MemberTable
            members={members}
            memberMeals={dayConfig.memberMeals}
            settings={settings}
            onMealChange={onMealChange}
            onBulkChange={onBulkChange}
          />
        </div>
      )}
    </div>
  );
}

export default function NonUniformModePanel({
  dates,
  members,
  nonUniformMeals,
  prices,
  onDayHolidayChange,
  onMealChange,
  onBulkChange,
}: NonUniformModePanelProps) {
  if (dates.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        Vui lòng chọn khoảng ngày hợp lệ.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {dates.map((date) => {
        const dayConfig = nonUniformMeals[date] ?? { isHoliday: false, memberMeals: {} };
        return (
          <DayAccordion
            key={date}
            date={date}
            members={members}
            dayConfig={dayConfig}
            prices={prices}
            onHolidayChange={(isHoliday) => onDayHolidayChange(date, isHoliday)}
            onMealChange={(member, meal, value) => onMealChange(date, member, meal, value)}
            onBulkChange={(meal, value) => onBulkChange(date, meal, value)}
          />
        );
      })}
    </div>
  );
}
