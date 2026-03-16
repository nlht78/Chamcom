'use client';

import { useState, useEffect } from 'react';
import { calculateTotal } from '@/lib/calculations';
import { formatCurrency, formatDateToYYYYMMDD } from '@/lib/formatting';
import { validateForm } from '@/lib/validation';
import { saveMealRecord } from '@/app/actions';
import PriceInput from './PriceInput';
import TotalDisplay from './TotalDisplay';

interface MealFormState {
  date: string;
  employeeName: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  isHoliday: boolean;
  isSubmitting: boolean;
}

const DEFAULT_FORM_STATE: MealFormState = {
  date: formatDateToYYYYMMDD(new Date().toISOString()),
  employeeName: '',
  breakfast: false,
  lunch: false,
  dinner: false,
  breakfastPrice: 12000,
  lunchPrice: 30000,
  dinnerPrice: 30000,
  isHoliday: false,
  isSubmitting: false,
};

export default function MealForm() {
  const [formState, setFormState] = useState<MealFormState>(DEFAULT_FORM_STATE);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate total whenever relevant fields change
  useEffect(() => {
    const newTotal = calculateTotal(
      formState.breakfast,
      formState.lunch,
      formState.dinner,
      formState.breakfastPrice,
      formState.lunchPrice,
      formState.dinnerPrice,
      formState.isHoliday ? 2 : 1
    );
    setTotal(newTotal);
  }, [
    formState.breakfast,
    formState.lunch,
    formState.dinner,
    formState.breakfastPrice,
    formState.lunchPrice,
    formState.dinnerPrice,
    formState.isHoliday,
  ]);

  // Reset form to default values
  const resetForm = () => {
    setFormState(DEFAULT_FORM_STATE);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage(null);
    
    // Validate form
    const validation = validateForm({
      date: formState.date,
      employeeName: formState.employeeName,
      breakfast: formState.breakfast,
      lunch: formState.lunch,
      dinner: formState.dinner,
      breakfastPrice: formState.breakfastPrice,
      lunchPrice: formState.lunchPrice,
      dinnerPrice: formState.dinnerPrice,
      isHoliday: formState.isHoliday,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setMessage({ type: 'error', text: 'Vui lòng kiểm tra lại thông tin' });
      return;
    }

    setErrors({});
    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      const result = await saveMealRecord({
        date: formState.date,
        employeeName: formState.employeeName,
        breakfast: formState.breakfast,
        lunch: formState.lunch,
        dinner: formState.dinner,
        breakfastPrice: formState.breakfastPrice,
        lunchPrice: formState.lunchPrice,
        dinnerPrice: formState.dinnerPrice,
        isHoliday: formState.isHoliday,
      });

      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        // Reset form after successful save
        resetForm();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      {/* Date Input */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Ngày
        </label>
        <input
          type="date"
          id="date"
          value={formState.date}
          onChange={(e) => setFormState(prev => ({ ...prev, date: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Employee Name Input */}
      <div>
        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
          Tên Nhân Viên
        </label>
        <input
          type="text"
          id="employeeName"
          value={formState.employeeName}
          onChange={(e) => setFormState(prev => ({ ...prev, employeeName: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.employeeName ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Nhập tên nhân viên"
        />
        {errors.employeeName && <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>}
      </div>

      {/* Meal Checkboxes and Prices */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-gray-700">Chọn bữa ăn</p>
        
        <div className="space-y-3 bg-gray-50 p-3 sm:p-4 rounded-md">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="breakfast"
              checked={formState.breakfast}
              onChange={(e) => setFormState(prev => ({ ...prev, breakfast: e.target.checked }))}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="breakfast" className="text-sm font-medium text-gray-700 min-w-[60px]">Sáng</label>
          </div>
          <PriceInput
            label="Giá sáng"
            value={formState.breakfastPrice}
            onChange={(value) => setFormState(prev => ({ ...prev, breakfastPrice: value }))}
          />
          {errors.breakfastPrice && <p className="text-red-500 text-sm">{errors.breakfastPrice}</p>}
        </div>

        <div className="space-y-3 bg-gray-50 p-3 sm:p-4 rounded-md">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="lunch"
              checked={formState.lunch}
              onChange={(e) => setFormState(prev => ({ ...prev, lunch: e.target.checked }))}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="lunch" className="text-sm font-medium text-gray-700 min-w-[60px]">Trưa</label>
          </div>
          <PriceInput
            label="Giá trưa"
            value={formState.lunchPrice}
            onChange={(value) => setFormState(prev => ({ ...prev, lunchPrice: value }))}
          />
          {errors.lunchPrice && <p className="text-red-500 text-sm">{errors.lunchPrice}</p>}
        </div>

        <div className="space-y-3 bg-gray-50 p-3 sm:p-4 rounded-md">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="dinner"
              checked={formState.dinner}
              onChange={(e) => setFormState(prev => ({ ...prev, dinner: e.target.checked }))}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="dinner" className="text-sm font-medium text-gray-700 min-w-[60px]">Chiều</label>
          </div>
          <PriceInput
            label="Giá chiều"
            value={formState.dinnerPrice}
            onChange={(value) => setFormState(prev => ({ ...prev, dinnerPrice: value }))}
          />
          {errors.dinnerPrice && <p className="text-red-500 text-sm">{errors.dinnerPrice}</p>}
        </div>
      </div>

      {/* Holiday Checkbox */}
      <div className="flex items-center space-x-2 bg-yellow-50 p-3 rounded-md">
        <input
          type="checkbox"
          id="isHoliday"
          checked={formState.isHoliday}
          onChange={(e) => setFormState(prev => ({ ...prev, isHoliday: e.target.checked }))}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isHoliday" className="text-sm font-medium text-gray-700">
          Ngày lễ (Hệ số x2)
        </label>
      </div>

      {/* Total Display */}
      <TotalDisplay total={total} />

      {/* Message Display */}
      {message && (
        <div className={`p-3 sm:p-4 rounded-md text-sm sm:text-base ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={formState.isSubmitting}
        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
          formState.isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
        }`}
      >
        {formState.isSubmitting ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  );
}
