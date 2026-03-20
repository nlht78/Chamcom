'use client';

interface ModeToggleProps {
  mode: 'single' | 'range';
  onChange: (mode: 'single' | 'range') => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex rounded-lg border border-gray-200 bg-white p-1 gap-1 w-fit">
      <button
        type="button"
        onClick={() => onChange('single')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          mode === 'single'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Một ngày
      </button>
      <button
        type="button"
        onClick={() => onChange('range')}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          mode === 'range'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        Khoảng ngày
      </button>
    </div>
  );
}
