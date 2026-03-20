'use client';

import { formatCurrency } from '@/lib/formatting';
import { validatePrice } from '@/lib/validation';

interface RangeSettings {
  startDate: string;       // YYYY-MM-DD
  endDate: string;         // YYYY-MM-DD
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
}

interface RangeSettingsProps {
  settings: RangeSettings;
  errors: Record<string, string>;
  onChange: (settings: RangeSettings) => void;
}

/**
 * Component nhập khoảng ngày và giá các bữa ăn.
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8
 */
export default function RangeSettings({ settings, errors, onChange }: RangeSettingsProps) {
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onChange({ ...settings, [field]: value });
  };

  const handlePriceChange = (
    field: 'breakfastPrice' | 'lunchPrice' | 'dinnerPrice',
    rawValue: string
  ) => {
    if (rawValue === '') return;
    const num = Number(rawValue);
    if (validatePrice(num)) {
      onChange({ ...settings, [field]: num });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <h2 className="text-sm font-semibold text-gray-700">Khoảng ngày &amp; Giá bữa ăn</h2>

      {/* Date range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* startDate */}
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Từ ngày
          </label>
          <input
            type="date"
            value={settings.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.startDate && (
            <p className="text-xs text-red-600">{errors.startDate}</p>
          )}
        </div>

        {/* endDate */}
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Đến ngày
          </label>
          <input
            type="date"
            value={settings.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.endDate && (
            <p className="text-xs text-red-600">{errors.endDate}</p>
          )}
        </div>
      </div>

      {/* dateRange error (spans both date fields) */}
      {errors.dateRange && (
        <p className="text-xs text-red-600">{errors.dateRange}</p>
      )}

      {/* Price fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* breakfastPrice */}
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Giá bữa sáng
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={settings.breakfastPrice}
              onChange={(e) => handlePriceChange('breakfastPrice', e.target.value)}
              min="1"
              step="1000"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-xs text-gray-500 min-w-[60px]">
              {formatCurrency(settings.breakfastPrice)}
            </span>
          </div>
          {errors.breakfastPrice && (
            <p className="text-xs text-red-600">{errors.breakfastPrice}</p>
          )}
        </div>

        {/* lunchPrice */}
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Giá bữa trưa
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={settings.lunchPrice}
              onChange={(e) => handlePriceChange('lunchPrice', e.target.value)}
              min="1"
              step="1000"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-xs text-gray-500 min-w-[60px]">
              {formatCurrency(settings.lunchPrice)}
            </span>
          </div>
          {errors.lunchPrice && (
            <p className="text-xs text-red-600">{errors.lunchPrice}</p>
          )}
        </div>

        {/* dinnerPrice */}
        <div className="flex flex-col gap-1">
          <label className="text-xs sm:text-sm font-medium text-gray-700">
            Giá bữa chiều
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={settings.dinnerPrice}
              onChange={(e) => handlePriceChange('dinnerPrice', e.target.value)}
              min="1"
              step="1000"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-xs text-gray-500 min-w-[60px]">
              {formatCurrency(settings.dinnerPrice)}
            </span>
          </div>
          {errors.dinnerPrice && (
            <p className="text-xs text-red-600">{errors.dinnerPrice}</p>
          )}
        </div>
      </div>
    </div>
  );
}
