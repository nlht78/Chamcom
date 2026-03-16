'use client';

import { useRef, useEffect } from 'react';
import MemberRow from './MemberRow';

interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

interface BatchSettings {
  date: string;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  isHoliday: boolean;
}

interface MemberTableProps {
  members: string[];
  memberMeals: Record<string, MemberMeals>;
  settings: BatchSettings;
  onMealChange: (member: string, meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
  onBulkChange: (meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

function useHeaderCheckbox(
  members: string[],
  memberMeals: Record<string, MemberMeals>,
  meal: MealType
) {
  const ref = useRef<HTMLInputElement>(null);

  const allChecked = members.length > 0 && members.every((m) => memberMeals[m]?.[meal]);
  const someChecked = members.some((m) => memberMeals[m]?.[meal]);
  const indeterminate = someChecked && !allChecked;

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return { ref, checked: allChecked, indeterminate };
}

export default function MemberTable({
  members,
  memberMeals,
  settings,
  onMealChange,
  onBulkChange,
}: MemberTableProps) {
  const breakfast = useHeaderCheckbox(members, memberMeals, 'breakfast');
  const lunch = useHeaderCheckbox(members, memberMeals, 'lunch');
  const dinner = useHeaderCheckbox(members, memberMeals, 'dinner');

  const headerCheckboxes: { meal: MealType; label: string; state: ReturnType<typeof useHeaderCheckbox> }[] = [
    { meal: 'breakfast', label: 'Sáng', state: breakfast },
    { meal: 'lunch', label: 'Trưa', state: lunch },
    { meal: 'dinner', label: 'Chiều', state: dinner },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Tên nhân viên</th>
            {headerCheckboxes.map(({ meal, label, state }) => (
              <th key={meal} className="px-4 py-3 text-center font-semibold">
                <div className="flex flex-col items-center gap-1">
                  <span>{label}</span>
                  <input
                    ref={state.ref}
                    type="checkbox"
                    checked={state.checked}
                    onChange={(e) => onBulkChange(meal, e.target.checked)}
                    className="w-4 h-4 accent-blue-600 cursor-pointer"
                    aria-label={`Chọn tất cả bữa ${label.toLowerCase()}`}
                  />
                </div>
              </th>
            ))}
            <th className="px-4 py-3 text-right font-semibold">Tổng tiền</th>
            <th className="px-2 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <MemberRow
              key={member}
              name={member}
              meals={memberMeals[member] ?? { breakfast: false, lunch: false, dinner: false }}
              settings={settings}
              onChange={(meal, value) => onMealChange(member, meal, value)}
              onClear={() => {
                onMealChange(member, 'breakfast', false);
                onMealChange(member, 'lunch', false);
                onMealChange(member, 'dinner', false);
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
