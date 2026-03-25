'use client';

import { useState, useEffect } from 'react';
import { calculateTotal } from '@/lib/calculations';
import { formatCurrency, formatDateToYYYYMMDD } from '@/lib/formatting';
import { validateDate, validateEmployeeName, validatePrice } from '@/lib/validation';
import { saveMealRecord, ensureEmployeeInSummary } from '@/app/actions';
import TotalDisplay from './TotalDisplay';

const today = formatDateToYYYYMMDD(new Date().toISOString());

export default function MealForm() {
  const [date, setDate] = useState(today);
  const [employeeName, setEmployeeName] = useState('');
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [breakfastPrice, setBreakfastPrice] = useState('12000');
  const [lunchPrice, setLunchPrice] = useState('30000');
  const [dinnerPrice, setDinnerPrice] = useState('30000');
  const [isHoliday, setIsHoliday] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bp = Number(breakfastPrice) || 0;
  const lp = Number(lunchPrice) || 0;
  const dp = Number(dinnerPrice) || 0;

  const total = calculateTotal(breakfast, lunch, dinner, bp, lp, dp, isHoliday ? 2 : 1);

  const resetForm = () => {
    setDate(today);
    setEmployeeName('');
    setBreakfast(false);
    setLunch(false);
    setDinner(false);
    setBreakfastPrice('12000');
    setLunchPrice('30000');
    setDinnerPrice('30000');
    setIsHoliday(false);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const newErrors: Record<string, string> = {};
    if (!validateDate(date)) newErrors.date = 'Vui lòng chọn ngày hợp lệ';
    if (!validateEmployeeName(employeeName)) newErrors.employeeName = 'Vui lòng nhập tên nhân viên';
    if (!validatePrice(bp)) newErrors.breakfastPrice = 'Giá sáng phải là số dương';
    if (!validatePrice(lp)) newErrors.lunchPrice = 'Giá trưa phải là số dương';
    if (!validatePrice(dp)) newErrors.dinnerPrice = 'Giá chiều phải là số dương';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await saveMealRecord({
        date, employeeName, breakfast, lunch, dinner,
        breakfastPrice: bp, lunchPrice: lp, dinnerPrice: dp, isHoliday,
      });
      if (result.success) {
        // Nếu tên chưa có trong Tổng hợp tháng thì tự động thêm vào
        await ensureEmployeeInSummary(employeeName);
        setMessage({ type: 'success', text: result.message });
        resetForm();
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = (err?: string) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${err ? 'border-red-500' : 'border-gray-300'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      {/* Date */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls(errors.date)} />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Employee Name */}
      <div>
        <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">Tên Nhân Viên</label>
        <input type="text" id="employeeName" value={employeeName} onChange={e => setEmployeeName(e.target.value)}
          placeholder="Nhập tên nhân viên" className={inputCls(errors.employeeName)} />
        {errors.employeeName && <p className="text-red-500 text-sm mt-1">{errors.employeeName}</p>}
      </div>

      {/* Meals + Prices */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Chọn bữa ăn</p>

        {([
          { id: 'breakfast', label: 'Sáng', checked: breakfast, setChecked: setBreakfast, priceVal: breakfastPrice, setPrice: setBreakfastPrice, errKey: 'breakfastPrice' },
          { id: 'lunch',     label: 'Trưa', checked: lunch,     setChecked: setLunch,     priceVal: lunchPrice,     setPrice: setLunchPrice,     errKey: 'lunchPrice' },
          { id: 'dinner',    label: 'Chiều',checked: dinner,    setChecked: setDinner,    priceVal: dinnerPrice,    setPrice: setDinnerPrice,    errKey: 'dinnerPrice' },
        ] as const).map(({ id, label, checked, setChecked, priceVal, setPrice, errKey }) => (
          <div key={id} className="bg-gray-50 p-3 rounded-md space-y-2">
            <div className="flex items-center gap-3">
              <input type="checkbox" id={id} checked={checked} onChange={e => setChecked(e.target.checked)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
              <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" value={priceVal} onChange={e => setPrice(e.target.value)}
                placeholder="Nhập giá" min="0" step="1000"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-xs text-gray-500 min-w-[80px]">{formatCurrency(Number(priceVal) || 0)}</span>
            </div>
            {errors[errKey] && <p className="text-red-500 text-xs">{errors[errKey]}</p>}
          </div>
        ))}
      </div>

      {/* Holiday */}
      <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-md">
        <input type="checkbox" id="isHoliday" checked={isHoliday} onChange={e => setIsHoliday(e.target.checked)}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
        <label htmlFor="isHoliday" className="text-sm font-medium text-gray-700">Ngày lễ (Hệ số x2)</label>
      </div>

      <TotalDisplay total={total} />

      {message && (
        <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <button type="submit" disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}>
        {isSubmitting ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  );
}
