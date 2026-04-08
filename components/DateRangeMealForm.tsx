'use client';

import { useState, useMemo } from 'react';
import { GroupId, GROUP_TEMPLATES } from '@/lib/groupTemplates';
import { validateDateRange, validatePrice } from '@/lib/validation';
import { generateDateRange } from '@/lib/dateRangeUtils';
import { buildUniformRecords } from '@/lib/uniformRecords';
import { buildNonUniformRecords } from '@/lib/nonUniformRecords';
import { saveMealRecords } from '@/app/actions';
import GroupSelector from './GroupSelector';
import RangeSettings from './RangeSettings';
import UniformModePanel from './UniformModePanel';
import NonUniformModePanel from './NonUniformModePanel';
import RecordCountBadge from './RecordCountBadge';

import { DEFAULT_PRICES } from './PriceEditor';

// ─── Types ────────────────────────────────────────────────────────────────────

interface RangeSettingsState {
  startDate: string;
  endDate: string;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
}

interface MemberMeals {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

type UniformMeals = Record<string, MemberMeals>;

interface DayConfig {
  isHoliday: boolean;
  memberMeals: Record<string, MemberMeals>;
}

type NonUniformMeals = Record<string, DayConfig>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];

const DEFAULT_RANGE_SETTINGS: RangeSettingsState = {
  startDate: today,
  endDate: today,
  breakfastPrice: DEFAULT_PRICES.breakfastPrice,
  lunchPrice: DEFAULT_PRICES.lunchPrice,
  dinnerPrice: DEFAULT_PRICES.dinnerPrice,
};

function buildInitialUniformMeals(members: string[]): UniformMeals {
  const meals: UniformMeals = {};
  for (const m of members) {
    meals[m] = { breakfast: false, lunch: false, dinner: false };
  }
  return meals;
}

function buildInitialNonUniformMeals(members: string[], dates: string[]): NonUniformMeals {
  const meals: NonUniformMeals = {};
  for (const date of dates) {
    const memberMeals: Record<string, MemberMeals> = {};
    for (const m of members) {
      memberMeals[m] = { breakfast: false, lunch: false, dinner: false };
    }
    meals[date] = { isHoliday: false, memberMeals };
  }
  return meals;
}

function resetUniformMeals(prev: UniformMeals): UniformMeals {
  const reset: UniformMeals = {};
  for (const name of Object.keys(prev)) {
    reset[name] = { breakfast: false, lunch: false, dinner: false };
  }
  return reset;
}

function resetNonUniformMeals(prev: NonUniformMeals): NonUniformMeals {
  const reset: NonUniformMeals = {};
  for (const date of Object.keys(prev)) {
    const memberMeals: Record<string, MemberMeals> = {};
    for (const name of Object.keys(prev[date].memberMeals)) {
      memberMeals[name] = { breakfast: false, lunch: false, dinner: false };
    }
    reset[date] = { isHoliday: prev[date].isHoliday, memberMeals };
  }
  return reset;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DateRangeMealForm() {
  const [selectedGroup, setSelectedGroup] = useState<GroupId | null>(null);
  const [rangeSettings, setRangeSettings] = useState<RangeSettingsState>(DEFAULT_RANGE_SETTINGS);
  const [uniformMode, setUniformMode] = useState<'uniform' | 'non-uniform'>('uniform');
  const [uniformMeals, setUniformMeals] = useState<UniformMeals>({});
  const [nonUniformMeals, setNonUniformMeals] = useState<NonUniformMeals>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Derived ────────────────────────────────────────────────────────────────

  const currentTemplate = GROUP_TEMPLATES.find((t) => t.id === selectedGroup);
  const members = currentTemplate?.members ?? [];
  const dates = useMemo(
    () => generateDateRange(rangeSettings.startDate, rangeSettings.endDate),
    [rangeSettings.startDate, rangeSettings.endDate]
  );

  // ── Record count (task 9.2) ────────────────────────────────────────────────

  const recordCount = useMemo(() => {
    if (uniformMode === 'uniform') {
      const membersWithMeals = members.filter(
        (name) =>
          uniformMeals[name]?.breakfast ||
          uniformMeals[name]?.lunch ||
          uniformMeals[name]?.dinner
      );
      return membersWithMeals.length * dates.length;
    } else {
      return dates.reduce((total, date) => {
        const dayConfig = nonUniformMeals[date];
        if (!dayConfig) return total;
        const count = members.filter(
          (name) =>
            dayConfig.memberMeals[name]?.breakfast ||
            dayConfig.memberMeals[name]?.lunch ||
            dayConfig.memberMeals[name]?.dinner
        ).length;
        return total + count;
      }, 0);
    }
  }, [uniformMode, uniformMeals, nonUniformMeals, members, dates]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleGroupSelect = (group: GroupId) => {
    const template = GROUP_TEMPLATES.find((t) => t.id === group);
    const groupMembers = template?.members ?? [];
    setSelectedGroup(group);
    setUniformMode('uniform');
    setUniformMeals(buildInitialUniformMeals(groupMembers));
    setNonUniformMeals(buildInitialNonUniformMeals(groupMembers, dates));
    setMessage(null);
    setErrors({});
  };

  const handleRangeSettingsChange = (settings: RangeSettingsState) => {
    setRangeSettings(settings);
    // Re-initialise nonUniformMeals for the new date range when group is selected
    if (selectedGroup) {
      const newDates = generateDateRange(settings.startDate, settings.endDate);
      setNonUniformMeals(buildInitialNonUniformMeals(members, newDates));
    }
  };

  const handleUniformModeChange = (mode: 'uniform' | 'non-uniform') => {
    setUniformMode(mode);
    setMessage(null);
  };

  // Uniform meal handlers
  const handleUniformMealChange = (
    member: string,
    meal: 'breakfast' | 'lunch' | 'dinner',
    value: boolean
  ) => {
    setUniformMeals((prev) => ({
      ...prev,
      [member]: { ...prev[member], [meal]: value },
    }));
  };

  const handleUniformBulkChange = (meal: 'breakfast' | 'lunch' | 'dinner', value: boolean) => {
    setUniformMeals((prev) => {
      const updated = { ...prev };
      for (const member of Object.keys(updated)) {
        updated[member] = { ...updated[member], [meal]: value };
      }
      return updated;
    });
  };

  // Non-uniform meal handlers
  const handleDayHolidayChange = (date: string, isHoliday: boolean) => {
    setNonUniformMeals((prev) => ({
      ...prev,
      [date]: { ...prev[date], isHoliday },
    }));
  };

  const handleNonUniformMealChange = (
    date: string,
    member: string,
    meal: 'breakfast' | 'lunch' | 'dinner',
    value: boolean
  ) => {
    setNonUniformMeals((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        memberMeals: {
          ...prev[date]?.memberMeals,
          [member]: { ...prev[date]?.memberMeals?.[member], [meal]: value },
        },
      },
    }));
  };

  const handleNonUniformBulkChange = (
    date: string,
    meal: 'breakfast' | 'lunch' | 'dinner',
    value: boolean
  ) => {
    setNonUniformMeals((prev) => {
      const dayConfig = prev[date] ?? { isHoliday: false, memberMeals: {} };
      const updatedMemberMeals = { ...dayConfig.memberMeals };
      for (const member of members) {
        updatedMemberMeals[member] = { ...updatedMemberMeals[member], [meal]: value };
      }
      return { ...prev, [date]: { ...dayConfig, memberMeals: updatedMemberMeals } };
    });
  };

  // ── Save handler (task 9.3) ────────────────────────────────────────────────

  const handleSaveAll = async () => {
    // Validate date range
    const dateRangeResult = validateDateRange(rangeSettings.startDate, rangeSettings.endDate);
    const newErrors: Record<string, string> = { ...dateRangeResult.errors };

    // Validate prices
    if (!validatePrice(rangeSettings.breakfastPrice)) {
      newErrors.breakfastPrice = 'Giá sáng phải là số dương';
    }
    if (!validatePrice(rangeSettings.lunchPrice)) {
      newErrors.lunchPrice = 'Giá trưa phải là số dương';
    }
    if (!validatePrice(rangeSettings.dinnerPrice)) {
      newErrors.dinnerPrice = 'Giá chiều phải là số dương';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Check record count
    if (recordCount === 0) {
      setMessage({ type: 'error', text: 'Vui lòng chọn ít nhất một bữa ăn' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Build records
    const prices = {
      breakfastPrice: rangeSettings.breakfastPrice,
      lunchPrice: rangeSettings.lunchPrice,
      dinnerPrice: rangeSettings.dinnerPrice,
    };

    const records =
      uniformMode === 'uniform'
        ? buildUniformRecords(members, uniformMeals, rangeSettings.startDate, rangeSettings.endDate, prices)
        : buildNonUniformRecords(members, nonUniformMeals, dates, prices);

    const result = await saveMealRecords(records);

    if (result.success) {
      // Reset meal checkboxes, keep rangeSettings and selectedGroup
      setUniformMeals((prev) => resetUniformMeals(prev));
      setNonUniformMeals((prev) => resetNonUniformMeals(prev));
      setMessage({ type: 'success', text: `Đã lưu ${records.length} bản ghi thành công!` });
    } else {
      setMessage({ type: 'error', text: 'Lưu thất bại. Vui lòng thử lại.' });
    }

    setIsSubmitting(false);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Range settings */}
      <RangeSettings
        settings={rangeSettings}
        errors={errors}
        onChange={handleRangeSettingsChange}
      />

      {/* Group selector */}
      <GroupSelector selectedGroup={selectedGroup} onSelect={handleGroupSelect} />

      {!selectedGroup && (
        <p className="text-gray-500 text-sm">Vui lòng chọn một nhóm để bắt đầu chấm cơm.</p>
      )}

      {selectedGroup && (
        <div className="space-y-4">
          {/* Uniform / Non-uniform mode toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleUniformModeChange('uniform')}
              className={
                uniformMode === 'uniform'
                  ? 'px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-500 text-white font-semibold transition-colors'
                  : 'px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:border-blue-300 hover:bg-blue-50 transition-colors'
              }
            >
              Đồng nhất
            </button>
            <button
              type="button"
              onClick={() => handleUniformModeChange('non-uniform')}
              className={
                uniformMode === 'non-uniform'
                  ? 'px-4 py-2 rounded-lg border-2 border-blue-500 bg-blue-500 text-white font-semibold transition-colors'
                  : 'px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:border-blue-300 hover:bg-blue-50 transition-colors'
              }
            >
              Không đồng nhất
            </button>
          </div>

          {/* Meal panel */}
          {uniformMode === 'uniform' ? (
            <UniformModePanel
              members={members}
              memberMeals={uniformMeals}
              prices={{
                breakfastPrice: rangeSettings.breakfastPrice,
                lunchPrice: rangeSettings.lunchPrice,
                dinnerPrice: rangeSettings.dinnerPrice,
              }}
              onMealChange={handleUniformMealChange}
              onBulkChange={handleUniformBulkChange}
            />
          ) : (
            <NonUniformModePanel
              dates={dates}
              members={members}
              nonUniformMeals={nonUniformMeals}
              prices={{
                breakfastPrice: rangeSettings.breakfastPrice,
                lunchPrice: rangeSettings.lunchPrice,
                dinnerPrice: rangeSettings.dinnerPrice,
              }}
              onDayHolidayChange={handleDayHolidayChange}
              onMealChange={handleNonUniformMealChange}
              onBulkChange={handleNonUniformBulkChange}
            />
          )}

          {/* Record count badge */}
          <RecordCountBadge count={recordCount} />

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

          {/* Save button */}
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
