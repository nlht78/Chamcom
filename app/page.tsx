import BatchMealForm from '@/components/BatchMealForm';

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
          Chấm Cơm Cơ Quan
        </h1>
        <BatchMealForm />
      </div>
    </main>
  );
}
