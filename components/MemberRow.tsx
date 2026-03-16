import { calculateTotal } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatting';

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

interface MemberRowProps {
  name: string;
  meals: MemberMeals;
  settings: BatchSettings;
  onChange: (meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => void;
  onClear: () => void;
}

export default function MemberRow({ name, meals, settings, onChange, onClear }: MemberRowProps) {
  const multiplier = settings.isHoliday ? 2 : 1;
  const total = calculateTotal(
    meals.breakfast,
    meals.lunch,
    meals.dinner,
    settings.breakfastPrice,
    settings.lunchPrice,
    settings.dinnerPrice,
    multiplier
  );

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-2 text-sm text-gray-800">{name}</td>
      <td className="px-4 py-2 text-center">
        <input
          type="checkbox"
          checked={meals.breakfast}
          onChange={(e) => onChange('breakfast', e.target.checked)}
          className="w-4 h-4 accent-blue-600 cursor-pointer"
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="checkbox"
          checked={meals.lunch}
          onChange={(e) => onChange('lunch', e.target.checked)}
          className="w-4 h-4 accent-blue-600 cursor-pointer"
        />
      </td>
      <td className="px-4 py-2 text-center">
        <input
          type="checkbox"
          checked={meals.dinner}
          onChange={(e) => onChange('dinner', e.target.checked)}
          className="w-4 h-4 accent-blue-600 cursor-pointer"
        />
      </td>
      <td className="px-4 py-2 text-right text-sm font-medium text-gray-800">
        {formatCurrency(total)}
      </td>
      <td className="px-2 py-2 text-center">
        <button
          type="button"
          onClick={onClear}
          title="Bỏ chọn tất cả"
          className="text-gray-400 hover:text-red-500 transition-colors text-xs px-1"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
