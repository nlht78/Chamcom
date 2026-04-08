'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/formatting';

export const DEFAULT_PRICES = {
  breakfastPrice: 14400,
  lunchPrice: 28800,
  dinnerPrice: 28800,
};

interface Prices {
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
}

interface PriceEditorProps {
  prices: Prices;
  onChange: (prices: Prices) => void;
  errors?: Record<string, string>;
}

export default function PriceEditor({ prices, onChange, errors = {} }: PriceEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});

  const startEdit = () => {
    setDraft({
      breakfastPrice: String(prices.breakfastPrice),
      lunchPrice: String(prices.lunchPrice),
      dinnerPrice: String(prices.dinnerPrice),
    });
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const applyEdit = () => {
    onChange({
      breakfastPrice: Number(draft.breakfastPrice) || prices.breakfastPrice,
      lunchPrice: Number(draft.lunchPrice) || prices.lunchPrice,
      dinnerPrice: Number(draft.dinnerPrice) || prices.dinnerPrice,
    });
    setEditing(false);
  };

  const meals = [
    { key: 'breakfastPrice' as const, label: 'Sáng' },
    { key: 'lunchPrice' as const, label: 'Trưa' },
    { key: 'dinnerPrice' as const, label: 'Chiều' },
  ];

  return (
    <div className="bg-gray-50 rounded-md p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Giá bữa ăn</span>
        {!editing ? (
          <button
            type="button"
            onClick={startEdit}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
            </svg>
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-2">
            <button type="button" onClick={applyEdit}
              className="text-xs text-green-600 hover:text-green-800 font-medium">Xong</button>
            <button type="button" onClick={cancelEdit}
              className="text-xs text-gray-500 hover:text-gray-700 font-medium">Huỷ</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {meals.map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{label}</span>
            {editing ? (
              <>
                <input
                  type="number"
                  value={draft[key]}
                  onChange={e => setDraft(prev => ({ ...prev, [key]: e.target.value }))}
                  min="0"
                  step="100"
                  className="px-2 py-1.5 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[key] && <p className="text-xs text-red-600">{errors[key]}</p>}
              </>
            ) : (
              <span className="text-sm font-medium text-gray-800">
                {formatCurrency(prices[key])}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
