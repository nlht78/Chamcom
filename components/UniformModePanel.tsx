'use client';

import MemberTable from './MemberTable';

interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

type UniformMeals = Record<string, MemberMeals>;

interface UniformModePanelProps {
  members: string[];
  memberMeals: UniformMeals;
  prices: {
    breakfastPrice: number;
    lunchPrice: number;
    dinnerPrice: number;
  };
  onMealChange: (member: string, meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
  onBulkChange: (meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
}

export default function UniformModePanel({
  members,
  memberMeals,
  prices,
  onMealChange,
  onBulkChange,
}: UniformModePanelProps) {
  return (
    <MemberTable
      members={members}
      memberMeals={memberMeals}
      settings={{
        date: '',
        breakfastPrice: prices.breakfastPrice,
        lunchPrice: prices.lunchPrice,
        dinnerPrice: prices.dinnerPrice,
        isHoliday: false,
      }}
      onMealChange={onMealChange}
      onBulkChange={onBulkChange}
    />
  );
}
