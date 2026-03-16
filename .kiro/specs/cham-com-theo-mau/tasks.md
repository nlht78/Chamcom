# Kế Hoạch Triển Khai: Chấm Cơm Theo Mẫu

## Tổng Quan

Triển khai tính năng chấm cơm hàng loạt theo nhóm mẫu. Các bước xây dựng từ dữ liệu tĩnh → components UI → logic lưu → tích hợp vào trang chính.

## Tasks

- [x] 1. Tạo dữ liệu nhóm mẫu
  - Tạo file `lib/groupTemplates.ts` với type `GroupId`, interface `GroupTemplate`, và hằng số `GROUP_TEMPLATES` chứa 3 nhóm (DQTT 6 thành viên, Cán bộ 4 thành viên, Người ngoài 0 thành viên)
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Xây dựng component `GroupSelector`
  - [x] 2.1 Tạo `components/GroupSelector.tsx` hiển thị 3 nút chọn nhóm với props `selectedGroup` và `onSelect`
    - Nút active có style khác biệt (border/background highlight)
    - _Requirements: 1.1, 1.4, 1.5_

  - [ ]* 2.2 Viết unit test cho `GroupSelector`
    - Kiểm tra render đủ 3 nhóm
    - Kiểm tra callback `onSelect` được gọi khi nhấn nút
    - _Requirements: 1.1_

- [x] 3. Xây dựng component `MemberRow`
  - [x] 3.1 Tạo `components/MemberRow.tsx` hiển thị tên nhân viên, 3 checkbox bữa ăn, và tổng tiền
    - Tổng tiền tính bằng `calculateTotal` từ `lib/calculations.ts`
    - Props: `name`, `meals`, `settings`, `onChange`
    - _Requirements: 3.1, 3.4, 3.5, 6.1_

  - [ ]* 3.2 Viết property test cho `MemberRow` - Thuộc Tính 3
    - `// Feature: cham-com-theo-mau, Property 3: Tính đúng đắn của tổng tiền`
    - Dùng fast-check sinh ngẫu nhiên meals + prices + isHoliday, kiểm tra total hiển thị = `calculateTotal(...)`
    - **Validates: Requirements 3.4, 3.5**

- [x] 4. Xây dựng component `MemberTable`
  - [x] 4.1 Tạo `components/MemberTable.tsx` với header row chứa checkbox "chọn tất cả" cho mỗi bữa và danh sách `MemberRow`
    - Header checkbox dùng `ref.indeterminate` cho trạng thái hỗn hợp
    - Props: `members`, `memberMeals`, `settings`, `onMealChange`, `onBulkChange`
    - _Requirements: 3.1, 3.2, 4.1, 4.8, 4.9_

  - [ ]* 4.2 Viết property test cho `MemberTable` - Thuộc Tính 4
    - `// Feature: cham-com-theo-mau, Property 4: Bulk toggle đặt/xóa tất cả thành viên`
    - Dùng fast-check sinh ngẫu nhiên meal type + danh sách thành viên, kiểm tra bulk toggle on/off
    - **Validates: Requirements 4.2-4.7**

  - [ ]* 4.3 Viết property test cho `MemberTable` - Thuộc Tính 5
    - `// Feature: cham-com-theo-mau, Property 5: Trạng thái checkbox header phản ánh tổng hợp`
    - Dùng fast-check sinh ngẫu nhiên memberMeals, kiểm tra header checkbox state (checked/unchecked/indeterminate)
    - **Validates: Requirements 4.8, 4.9**

- [x] 5. Checkpoint - Kiểm tra các component cơ bản
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

- [x] 6. Xây dựng component `BatchMealForm`
  - [x] 6.1 Tạo `components/BatchMealForm.tsx` với state quản lý `selectedGroup`, `settings`, `memberMeals`, `isSubmitting`, `message`, `errors`
    - Khởi tạo `memberMeals` khi nhóm được chọn (tất cả false)
    - Render `GroupSelector`, `BatchSettings` (inline hoặc tách component), `MemberTable` hoặc `MealForm` tùy nhóm
    - _Requirements: 1.4, 1.5, 2.1, 2.2, 2.3, 3.3_

  - [ ]* 6.2 Viết property test cho `BatchMealForm` - Thuộc Tính 1
    - `// Feature: cham-com-theo-mau, Property 1: Thành viên nhóm khớp với mẫu`
    - Dùng fast-check sinh ngẫu nhiên GroupId (dqtt/can-bo), kiểm tra members hiển thị = GROUP_TEMPLATES[id].members
    - **Validates: Requirements 1.2, 1.3**

  - [ ]* 6.3 Viết property test cho `BatchMealForm` - Thuộc Tính 2
    - `// Feature: cham-com-theo-mau, Property 2: Trạng thái mặc định của checkbox bữa ăn`
    - Dùng fast-check sinh ngẫu nhiên GroupId, kiểm tra tất cả memberMeals = false khi nhóm mới được chọn
    - **Validates: Requirements 3.3**

- [x] 7. Triển khai logic cài đặt chung và validation
  - [x] 7.1 Thêm khu vực `BatchSettings` vào `BatchMealForm` với các trường: date, breakfastPrice, lunchPrice, dinnerPrice, isHoliday
    - Dùng `validateDate` và `validatePrice` từ `lib/validation.ts` để validate trước khi lưu
    - Hiển thị lỗi inline dưới từng trường
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 6.3_

  - [ ]* 7.2 Viết property test cho validation - Thuộc Tính 9
    - `// Feature: cham-com-theo-mau, Property 9: Validation ngăn lưu khi dữ liệu không hợp lệ`
    - Dùng fast-check sinh ngẫu nhiên invalid date/price, mock `saveMealRecord`, kiểm tra không được gọi
    - **Validates: Requirements 2.6, 2.7**

- [x] 8. Triển khai logic lưu hàng loạt
  - [x] 8.1 Thêm handler `handleSaveAll` vào `BatchMealForm`
    - Lọc thành viên có ít nhất 1 bữa ăn
    - Gọi `saveMealRecord` tuần tự cho từng thành viên
    - Xử lý lỗi một phần (partial failure)
    - Reset `memberMeals` sau khi lưu thành công, giữ nguyên `settings`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 6.2, 6.4, 6.5_

  - [ ]* 8.2 Viết property test - Thuộc Tính 6
    - `// Feature: cham-com-theo-mau, Property 6: Lưu chỉ lọc thành viên có bữa ăn`
    - Dùng fast-check sinh ngẫu nhiên memberMeals, mock `saveMealRecord`, kiểm tra chỉ members có meals được gọi
    - **Validates: Requirements 5.2, 5.3**

  - [ ]* 8.3 Viết property test - Thuộc Tính 7
    - `// Feature: cham-com-theo-mau, Property 7: Dữ liệu lưu khớp với trạng thái thành viên`
    - Dùng fast-check sinh ngẫu nhiên member + settings, kiểm tra MealFormData truyền vào saveMealRecord
    - **Validates: Requirements 5.2, 6.4**

  - [ ]* 8.4 Viết property test - Thuộc Tính 8
    - `// Feature: cham-com-theo-mau, Property 8: Reset sau khi lưu thành công`
    - Dùng fast-check sinh ngẫu nhiên group + meals + settings, sau save thành công kiểm tra meals = false, settings giữ nguyên
    - **Validates: Requirements 5.8**

- [x] 9. Tích hợp vào trang chính
  - [x] 9.1 Cập nhật `app/page.tsx` để render `BatchMealForm` thay cho `MealForm`
    - Tăng `max-w-2xl` lên `max-w-3xl` để bảng có đủ không gian
    - _Requirements: 1.1, 1.4_

- [x] 10. Checkpoint cuối - Đảm bảo tất cả tests pass
  - Đảm bảo tất cả tests pass, hỏi người dùng nếu có thắc mắc.

## Ghi Chú

- Tasks đánh dấu `*` là tùy chọn và có thể bỏ qua để triển khai nhanh hơn
- Mỗi property test dùng fast-check với tối thiểu 100 lần lặp
- `saveMealRecord` cần được mock trong tests vì là server action
- Trạng thái `indeterminate` của checkbox cần dùng `useRef` vì không phải HTML attribute chuẩn
