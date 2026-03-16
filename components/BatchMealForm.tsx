'use client';

import { useState } from 'react';
import { GroupId, GROUP_TEMPLATES } from '@/lib/groupTemplates';
import { validateDate, validatePrice } from '@/lib/validation';
import { saveMealRecord, saveMealRecords } from '@/app/actions';
import GroupSelector from './GroupSelector';
import MemberTable from './MemberTable';
import MealForm from './MealForm';

interface BatchSettings {
  date: string;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  isHoliday: boolean;
}

interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

const DEFAULT_SETTINGS: BatchSettings = {
  date: new Date().toISOString().split('T')[0],
  breakfastPrice: 12000,
  lunchPrice: 30000,
  dinnerPrice: 30000,
  isHoliday: false,
};

export default function BatchMealForm() {
  const [selectedGroup, setSelectedGroup] = useState<GroupId | null>(null);
  const [settings, setSettings] = useState<BatchSettings>(DEFAULT_SETTINGS);
  const [memberMeals, setMemberMeals] = useState<Record<string, MemberMeals>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGroupSelect = (group: GroupId) => {
    const template = GROUP_TEMPLATES.find((t) => t.id === group);
    const initialMeals: Record<string, MemberMeals> = {};
    if (template) {
      for (const member of template.members) {
        initialMeals[member] = { breakfast: false, lunch: false, dinner: false };
      }
    }
    setSelectedGroup(group);
    setMemberMeals(initialMeals);
    setMessage(null);
    setErrors({});
  };

  const handleMealChange = (
    member: string,
    meal: 'breakfast' | 'lunch' | 'dinner',
    value: boolean
  ) => {
    setMemberMeals((prev) => ({
      ...prev,
      [member]: { ...prev[member], [meal]: value },
    }));
  };

  const handleBulkChange = (meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => {
    setMemberMeals((prev) => {
      const updated = { ...prev };
      for (const member of Object.keys(updated)) {
        updated[member] = { ...updated[member], [meal]: value };
      }
      return updated;
    });
  };

  const validateSettings = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateDate(settings.date)) {
      newErrors.date = 'Vui lòng chọn ngày hợp lệ';
    }
    if (!validatePrice(settings.breakfastPrice)) {
      newErrors.breakfastPrice = 'Giá sáng phải là số dương';
    }
    if (!validatePrice(settings.lunchPrice)) {
      newErrors.lunchPrice = 'Giá trưa phải là số dương';
    }
    if (!validatePrice(settings.dinnerPrice)) {
      newErrors.dinnerPrice = 'Giá chiều phải là số dương';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAll = async () => {
    if (!validateSettings()) return;

    const membersToSave = members.filter(
      (name) =>
        memberMeals[name]?.breakfast ||
        memberMeals[name]?.lunch ||
        memberMeals[name]?.dinner
    );

    if (membersToSave.length === 0) {
      setMessage({ type: 'error', text: 'Vui lòng chọn ít nhất một bữa ăn' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    const result = await saveMealRecords(
      membersToSave.map((name) => ({
        date: settings.date,
        employeeName: name,
        breakfast: memberMeals[name].breakfast,
        lunch: memberMeals[name].lunch,
        dinner: memberMeals[name].dinner,
        breakfastPrice: settings.breakfastPrice,
        lunchPrice: settings.lunchPrice,
        dinnerPrice: settings.dinnerPrice,
        isHoliday: settings.isHoliday,
      }))
    );

    if (result.success) {
      const resetMeals: Record<string, MemberMeals> = {};
      for (const name of Object.keys(memberMeals)) {
        resetMeals[name] = { breakfast: false, lunch: false, dinner: false };
      }
      setMemberMeals(resetMeals);
      setMessage({ type: 'success', text: `Đã lưu ${membersToSave.length} bản ghi thành công!` });
    } else {
      setMessage({ type: 'error', text: `Lưu thất bại. Vui lòng thử lại.` });
    }

    setIsSubmitting(false);
  };

  const currentTemplate = GROUP_TEMPLATES.find((t) => t.id === selectedGroup);
  const members = currentTemplate?.members ?? [];
  const isBatchGroup = selectedGroup === 'dqtt' || selectedGroup === 'can-bo' || selectedGroup === 'can-bo-xa';

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Chấm Cơm Theo Mẫu</h2>

      {/* Group Selector */}
      <GroupSelector selectedGroup={selectedGroup} onSelect={handleGroupSelect} />

      {/* No group selected */}
      {!selectedGroup && (
        <p className="text-gray-500 text-sm">Vui lòng chọn một nhóm để bắt đầu chấm cơm.</p>
      )}

      {/* Người ngoài: use existing MealForm */}
      {selectedGroup === 'nguoi-ngoai' && <MealForm />}

      {/* DQTT or Cán bộ: BatchSettings + MemberTable */}
      {isBatchGroup && (
        <div className="space-y-6">
          {/* BatchSettings (inline) */}
          <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <h3 className="text-base font-semibold text-gray-700">Cài đặt chung</h3>

            {/* Date */}
            <div>
              <label htmlFor="batch-date" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày
              </label>
              <input
                type="date"
                id="batch-date"
                value={settings.date}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, date: e.target.value }))
                }
                className={`w-full sm:w-48 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="batch-breakfast-price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Giá sáng (đ)
                </label>
                <input
                  type="number"
                  id="batch-breakfast-price"
                  value={settings.breakfastPrice}
                  min={1}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      breakfastPrice: Number(e.target.value),
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.breakfastPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.breakfastPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.breakfastPrice}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="batch-lunch-price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Giá trưa (đ)
                </label>
                <input
                  type="number"
                  id="batch-lunch-price"
                  value={settings.lunchPrice}
                  min={1}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      lunchPrice: Number(e.target.value),
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.lunchPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lunchPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.lunchPrice}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="batch-dinner-price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Giá chiều (đ)
                </label>
                <input
                  type="number"
                  id="batch-dinner-price"
                  value={settings.dinnerPrice}
                  min={1}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      dinnerPrice: Number(e.target.value),
                    }))
                  }
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.dinnerPrice ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.dinnerPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.dinnerPrice}</p>
                )}
              </div>
            </div>

            {/* Holiday checkbox */}
            <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-md">
              <input
                type="checkbox"
                id="batch-holiday"
                checked={settings.isHoliday}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, isHoliday: e.target.checked }))
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="batch-holiday" className="text-sm font-medium text-gray-700">
                Ngày lễ (Hệ số x2)
              </label>
            </div>
          </div>

          {/* Member Table */}
          <MemberTable
            members={members}
            memberMeals={memberMeals}
            settings={settings}
            onMealChange={handleMealChange}
            onBulkChange={handleBulkChange}
          />

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Save button - logic added in task 8.1 */}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu tất cả'}
          </button>
        </div>
      )}
    </div>
  );
}
