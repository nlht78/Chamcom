'use client';

import { formatCurrency } from '@/lib/formatting';
import { validatePrice } from '@/lib/validation';

/**
 * Props cho component PriceInput
 */
interface PriceInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

/**
 * Component input có thể tái sử dụng cho các trường giá với định dạng tiền tệ Việt Nam
 * 
 * Validates: Requirements 4.2.1, 4.2.4
 */
export default function PriceInput({ label, value, onChange, disabled = false }: PriceInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Cho phép chuỗi rỗng để người dùng có thể xóa
    if (inputValue === '') {
      return;
    }
    
    // Chuyển đổi sang số
    const numValue = Number(inputValue);
    
    // Chỉ cập nhật nếu là số dương hợp lệ
    if (validatePrice(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs sm:text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          min="1"
          step="1000"
          className="flex-1 px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <span className="text-xs sm:text-sm font-medium text-gray-600 min-w-[80px] sm:min-w-[100px]">
          {formatCurrency(value)}
        </span>
      </div>
    </div>
  );
}
