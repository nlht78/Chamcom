'use client';
import { useState } from 'react';
import ModeToggle from '@/components/ModeToggle';
import BatchMealForm from '@/components/BatchMealForm';
import DateRangeMealForm from '@/components/DateRangeMealForm';

export default function Home() {
  const [mode, setMode] = useState<'single' | 'range'>('single');
  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">
          Chấm Cơm Cơ Quan
        </h1>
        <ModeToggle mode={mode} onChange={setMode} />
        {mode === 'single' ? <BatchMealForm /> : <DateRangeMealForm />}
      </div>
    </main>
  );
}
