'use client';

import PriceEditor from './PriceEditor';

interface RangeSettings {
  startDate: string;
  endDate: string;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
}

interface RangeSettingsProps {
  settings: RangeSettings;
  errors: Record<string, string>;
  onChange: (settings: RangeSettings) => void;
}

export default function RangeSettings({ settings, errors, onChange }: RangeSettingsProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Khoảng ngày &amp; Giá bữa ăn</h2>

      {/* Date range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Từ ngày</label>
          <input
            type="date"
            value={settings.startDate}
            onChange={e => onChange({ ...settings, startDate: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.startDate && <p className="text-xs text-red-600">{errors.startDate}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Đến ngày</label>
          <input
            type="date"
            value={settings.endDate}
            onChange={e => onChange({ ...settings, endDate: e.target.value })}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.endDate && <p className="text-xs text-red-600">{errors.endDate}</p>}
        </div>
      </div>
      {errors.dateRange && <p className="text-xs text-red-600">{errors.dateRange}</p>}

      <PriceEditor
        prices={{
          breakfastPrice: settings.breakfastPrice,
          lunchPrice: settings.lunchPrice,
          dinnerPrice: settings.dinnerPrice,
        }}
        onChange={p => onChange({ ...settings, ...p })}
        errors={errors}
      />
    </div>
  );
}
