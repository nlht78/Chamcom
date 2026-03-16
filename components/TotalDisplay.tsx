import { formatCurrency } from '@/lib/formatting';

interface TotalDisplayProps {
  total: number;
}

export default function TotalDisplay({ total }: TotalDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 sm:p-5 rounded-lg border-2 border-blue-200">
      <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium">Tổng cộng</p>
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">{formatCurrency(total)}</p>
    </div>
  );
}
