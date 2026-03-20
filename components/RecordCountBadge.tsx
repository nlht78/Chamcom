interface RecordCountBadgeProps {
  count: number;
}

/**
 * Hiển thị số bản ghi sẽ được lưu.
 * Validates: Requirements 6.1, 6.2
 */
export default function RecordCountBadge({ count }: RecordCountBadgeProps) {
  if (count === 0) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 text-gray-500 text-sm">
        <span>Chưa có bữa ăn nào được chọn</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 text-blue-700 text-sm font-medium">
      <span>Sẽ lưu {count} bản ghi</span>
    </div>
  );
}
