# Kế Hoạch Triển Khai: Chấm Cơm Theo Khoảng Ngày

## Tổng Quan

Triển khai tính năng chấm cơm theo khoảng ngày. Các bước xây dựng từ hàm tiện ích thuần túy → components UI → logic lưu → tích hợp vào trang chính.

## Tasks

- [x] 1. Tạo hàm tiện ích `generateDateRange`
  - Tạo file `lib/dateRangeUtils.ts` với hàm `generateDateRange(startDate, endDate): string[]` và `countDaysInRange(startDate, endDate): number`
  - `generateDateRange` trả về mảng ngày YYYY-MM-DD liên tiếp từ startDate đến endDate (bao gồm cả hai đầu mút), trả về mảng rỗng nếu startDate > endDate
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 7.1_

  - [x]* 1.1 Viết property test cho `generateDateRange` — Thuộc Tính 1
    - `// Feature: cham-com-theo-khoang-ngay, Property 1: generateDateRange trả về mảng ngày liên tiếp đúng thứ tự`
    - Dùng fast-check sinh ngẫu nhiên cặp ngày hợp lệ (startDate ≤ endDate), kiểm tra: mảng bao gồm startDate và endDate, các ngày liên tiếp nhau đúng 1 ngày, sắp xếp tăng dần, độ dài = số ngày trong khoảng
    - **Validates: Requirements 8.1, 8.3, 8.4, 7.1**

  - [x]* 1.2 Viết unit test cho edge cases của `generateDateRange` — Thuộc Tính 2
    - `// Feature: cham-com-theo-khoang-ngay, Property 2: generateDateRange — edge cases`
    - Kiểm tra startDate = endDate → mảng 1 phần tử; startDate > endDate → mảng rỗng
    - **Validates: Requirements 8.2, 8.5**

- [x] 2. Tạo hàm validation khoảng ngày
  - Thêm hàm `validateDateRange(startDate, endDate): ValidationResult` vào `lib/validation.ts`
  - Kiểm tra: cả hai ngày hợp lệ (dùng `validateDate`), endDate ≥ startDate, khoảng ≤ 31 ngày
  - Trả về object `{ isValid: boolean, errors: Record<string, string> }` với các key lỗi: `startDate`, `endDate`, `dateRange`
  - _Requirements: 2.5, 2.6, 2.7_

  - [x]* 2.1 Viết property test cho `validateDateRange` — Thuộc Tính 6 (phần validation)
    - `// Feature: cham-com-theo-khoang-ngay, Property 6: Validation ngăn lưu khi dữ liệu không hợp lệ`
    - Dùng fast-check sinh ngẫu nhiên: cặp ngày với endDate < startDate, khoảng > 31 ngày, chuỗi ngày không hợp lệ — kiểm tra `validateDateRange` trả về `isValid: false` với lỗi tương ứng
    - **Validates: Requirements 2.5, 2.6, 2.7**

- [x] 3. Xây dựng component `ModeToggle`
  - Tạo `components/ModeToggle.tsx` hiển thị hai nút "Một ngày" và "Khoảng ngày" với props `mode` và `onChange`
  - Nút active có style khác biệt (border/background highlight theo Tailwind CSS)
  - _Requirements: 1.1, 1.2_

- [x] 4. Xây dựng component `RangeSettings`
  - Tạo `components/RangeSettings.tsx` với các trường: startDate, endDate, breakfastPrice, lunchPrice, dinnerPrice
  - Hiển thị lỗi inline dưới từng trường khi có lỗi validation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8_

- [x] 5. Xây dựng component `RecordCountBadge`
  - Tạo `components/RecordCountBadge.tsx` hiển thị "Sẽ lưu X bản ghi" hoặc "Chưa có bữa ăn nào được chọn" khi count = 0
  - _Requirements: 6.1, 6.2_

- [x] 6. Xây dựng component `UniformModePanel`
  - Tạo `components/UniformModePanel.tsx` bọc `MemberTable` hiện có cho chế độ đồng nhất
  - Props: `members`, `memberMeals`, `prices`, `onMealChange`, `onBulkChange`
  - Truyền `isHoliday: false` vào `MemberTable` (hệ số ngày lễ không áp dụng trong chế độ đồng nhất)
  - _Requirements: 4.1, 4.2, 4.3_

  - [x]* 6.1 Viết property test cho số bản ghi đồng nhất — Thuộc Tính 3
    - `// Feature: cham-com-theo-khoang-ngay, Property 3: Số bản ghi đồng nhất = thành viên có bữa ăn × số ngày`
    - Dùng fast-check sinh ngẫu nhiên uniformMeals (Record<string, MemberMeals>) và khoảng ngày hợp lệ, kiểm tra hàm tạo danh sách bản ghi trả về đúng số lượng
    - **Validates: Requirements 4.4, 4.5, 7.2**

- [x] 7. Xây dựng component `NonUniformModePanel`
  - Tạo `components/NonUniformModePanel.tsx` hiển thị danh sách ngày dạng accordion
  - Mỗi ngày là một `DayAccordion` có thể mở/đóng, tiêu đề hiển thị ngày định dạng DD/MM/YYYY
  - Mỗi ngày có checkbox "Ngày lễ (Hệ số x2)" và bảng `MemberTable` bên trong khi mở rộng
  - Props: `dates`, `members`, `nonUniformMeals`, `prices`, `onDayHolidayChange`, `onMealChange`, `onBulkChange`
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.7_

  - [x]* 7.1 Viết property test cho số bản ghi không đồng nhất — Thuộc Tính 4
    - `// Feature: cham-com-theo-khoang-ngay, Property 4: Số bản ghi không đồng nhất = tổng cặp (thành viên có bữa ăn, ngày)`
    - Dùng fast-check sinh ngẫu nhiên nonUniformMeals (Record<string, DayConfig>) và khoảng ngày, kiểm tra hàm tạo danh sách bản ghi trả về đúng số lượng
    - **Validates: Requirements 5.5, 7.3**

  - [x]* 7.2 Viết property test cho hệ số ngày lễ per-day — Thuộc Tính 5
    - `// Feature: cham-com-theo-khoang-ngay, Property 5: Hệ số ngày lễ per-day trong chế độ không đồng nhất`
    - Dùng fast-check sinh ngẫu nhiên nonUniformMeals với isHoliday ngẫu nhiên cho từng ngày, kiểm tra mỗi bản ghi trong danh sách kết quả có `isHoliday` khớp với `DayConfig` của ngày tương ứng
    - **Validates: Requirements 5.3, 5.6, 7.3**

- [x] 8. Checkpoint — Kiểm tra các component cơ bản
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [x] 9. Xây dựng component `DateRangeMealForm`
  - [x] 9.1 Tạo `components/DateRangeMealForm.tsx` với state quản lý `selectedGroup`, `rangeSettings`, `uniformMode`, `uniformMeals`, `nonUniformMeals`, `isSubmitting`, `message`, `errors`
    - Khởi tạo `uniformMeals` và `nonUniformMeals` khi nhóm được chọn (tất cả false)
    - Render `RangeSettings`, `GroupSelector`, bộ chọn chế độ đồng nhất/không đồng nhất, `UniformModePanel` hoặc `NonUniformModePanel` tùy chế độ, `RecordCountBadge`, nút "Lưu tất cả"
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 9.2 Triển khai logic tính số bản ghi theo thời gian thực
    - Tính `recordCount` từ `uniformMeals`/`nonUniformMeals` và `generateDateRange` mỗi khi state thay đổi
    - Truyền `recordCount` vào `RecordCountBadge`
    - _Requirements: 4.4, 5.5, 6.1, 6.2_

  - [x] 9.3 Triển khai handler `handleSaveAll`
    - Validate `rangeSettings` bằng `validateDateRange` và `validatePrice`
    - Kiểm tra `recordCount > 0`
    - Tạo danh sách `MealFormData` từ `uniformMeals`/`nonUniformMeals` và `generateDateRange`
    - Gọi `saveMealRecords` với danh sách bản ghi
    - Reset checkbox bữa ăn sau khi lưu thành công, giữ nguyên `rangeSettings` và `selectedGroup`
    - _Requirements: 6.3, 6.4, 6.5, 6.6, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [x]* 9.4 Viết property test cho validation trong `DateRangeMealForm` — Thuộc Tính 6 (phần tích hợp)
    - `// Feature: cham-com-theo-khoang-ngay, Property 6: Validation ngăn lưu khi dữ liệu không hợp lệ`
    - Dùng fast-check sinh ngẫu nhiên đầu vào không hợp lệ, mock `saveMealRecords`, kiểm tra không được gọi
    - **Validates: Requirements 2.5, 2.6, 2.7, 2.8**

  - [x]* 9.5 Viết property test cho reset sau khi lưu — Thuộc Tính 7
    - `// Feature: cham-com-theo-khoang-ngay, Property 7: Reset sau khi lưu thành công`
    - Dùng fast-check sinh ngẫu nhiên trạng thái bữa ăn + settings, mock `saveMealRecords` trả về thành công, kiểm tra meals = false và settings giữ nguyên
    - **Validates: Requirements 7.7**

  - [x]* 9.6 Viết property test cho chuyển đổi chế độ — Thuộc Tính 8
    - `// Feature: cham-com-theo-khoang-ngay, Property 8: Chuyển đổi chế độ đặt lại trạng thái`
    - Dùng fast-check sinh ngẫu nhiên trạng thái nhập liệu, sau khi chuyển chế độ kiểm tra state về mặc định
    - **Validates: Requirements 1.5**

- [x] 10. Tích hợp vào `app/page.tsx`
  - Cập nhật `app/page.tsx` thành client component, thêm state `mode`, render `ModeToggle` và `BatchMealForm`/`DateRangeMealForm` tương ứng
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 11. Checkpoint cuối — Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

## Ghi Chú

- Tasks đánh dấu `*` là tùy chọn và có thể bỏ qua để triển khai nhanh hơn
- Mỗi property test dùng fast-check với tối thiểu 100 lần lặp
- `saveMealRecords` cần được mock trong tests vì là server action
- `generateDateRange` là hàm thuần túy, không cần mock — dễ kiểm thử trực tiếp
- `NonUniformModePanel` tái sử dụng `MemberTable` hiện có, chỉ cần bọc thêm accordion và checkbox ngày lễ
