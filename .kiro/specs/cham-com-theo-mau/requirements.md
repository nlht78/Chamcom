# Tài Liệu Yêu Cầu

## Giới Thiệu

Tính năng "Chấm Cơm Theo Mẫu" cho phép người dùng chấm cơm hàng loạt cho các nhóm nhân viên được định nghĩa sẵn, thay vì phải nhập từng người một. Người dùng chọn một nhóm (DQTT, Cán bộ, hoặc Người ngoài), sau đó đánh dấu bữa ăn cho tất cả thành viên trong nhóm cùng một lúc và lưu tất cả bản ghi chỉ với một thao tác.

## Bảng Thuật Ngữ

- **BatchMealForm**: Giao diện chấm cơm hàng loạt theo nhóm mẫu
- **GroupTemplate**: Mẫu nhóm nhân viên được định nghĩa sẵn (DQTT hoặc Cán bộ)
- **MemberRow**: Một hàng trong bảng chấm cơm đại diện cho một thành viên
- **BatchSettings**: Cài đặt chung áp dụng cho toàn bộ nhóm (ngày, giá, hệ số)
- **MealRecord**: Bản ghi bữa ăn của một nhân viên được lưu vào Google Sheets
- **BulkAction**: Thao tác áp dụng đồng thời cho tất cả thành viên trong nhóm
- **SaveAllAction**: Hành động lưu tất cả bản ghi của nhóm cùng một lúc

---

## Yêu Cầu

### Yêu Cầu 1: Chọn Nhóm Mẫu

**User Story:** Là người dùng, tôi muốn chọn một nhóm mẫu để chấm cơm, để tôi có thể nhanh chóng bắt đầu chấm cơm cho đúng nhóm nhân viên.

#### Tiêu Chí Chấp Nhận

1. THE BatchMealForm SHALL hiển thị ba lựa chọn nhóm: "DQTT (Dân quân tự vệ)", "Cán bộ", và "Người ngoài".
2. WHEN người dùng chọn nhóm "DQTT", THE BatchMealForm SHALL hiển thị bảng chấm cơm với 6 thành viên: Trần Long Hải, Lê Kỳ Hoàng, Lê Hà Hải Quân, Nguyễn Thành Đô, Nguyễn Lê Hiếu Thịnh, Lê Nguyễn Đức Tâm.
3. WHEN người dùng chọn nhóm "Cán bộ", THE BatchMealForm SHALL hiển thị bảng chấm cơm với 4 thành viên: Võ Văn Linh, Trần Cao Thi, Nguyễn Thành Kính, Đinh Kiều Anh Phụng.
4. WHEN người dùng chọn nhóm "Người ngoài", THE BatchMealForm SHALL hiển thị form chấm cơm cá nhân hiện có (MealForm).
5. THE BatchMealForm SHALL mặc định không chọn nhóm nào khi trang được tải lần đầu.

---

### Yêu Cầu 2: Cài Đặt Chung Cho Nhóm

**User Story:** Là người dùng, tôi muốn thiết lập ngày, giá bữa ăn và hệ số ngày lễ một lần cho cả nhóm, để tôi không phải nhập lại thông tin này cho từng người.

#### Tiêu Chí Chấp Nhận

1. THE BatchMealForm SHALL hiển thị một khu vực cài đặt chung bao gồm: trường ngày, giá bữa sáng, giá bữa trưa, giá bữa chiều, và checkbox ngày lễ.
2. THE BatchMealForm SHALL mặc định ngày là ngày hiện tại theo định dạng YYYY-MM-DD.
3. THE BatchMealForm SHALL mặc định giá bữa sáng là 12.000đ, giá bữa trưa là 30.000đ, giá bữa chiều là 30.000đ.
4. WHEN người dùng thay đổi bất kỳ cài đặt chung nào, THE BatchMealForm SHALL áp dụng thay đổi đó cho tất cả thành viên trong nhóm ngay lập tức.
5. WHEN người dùng bật checkbox "Ngày lễ (Hệ số x2)", THE BatchMealForm SHALL áp dụng hệ số nhân 2 cho tổng tiền của tất cả thành viên.
6. IF người dùng nhập ngày không hợp lệ, THEN THE BatchMealForm SHALL hiển thị thông báo lỗi "Vui lòng chọn ngày hợp lệ" và ngăn không cho lưu.
7. IF người dùng nhập giá không hợp lệ (không phải số dương), THEN THE BatchMealForm SHALL hiển thị thông báo lỗi tương ứng và ngăn không cho lưu.

---

### Yêu Cầu 3: Bảng Chấm Cơm Theo Nhóm

**User Story:** Là người dùng, tôi muốn xem tất cả thành viên trong nhóm trong một bảng và đánh dấu bữa ăn cho từng người, để tôi có thể chấm cơm nhanh chóng và chính xác.

#### Tiêu Chí Chấp Nhận

1. THE BatchMealForm SHALL hiển thị bảng với các cột: Tên nhân viên, Sáng (checkbox), Trưa (checkbox), Chiều (checkbox), Tổng tiền.
2. WHEN một nhóm được chọn, THE BatchMealForm SHALL hiển thị tất cả thành viên của nhóm đó trong bảng, mỗi người một hàng.
3. THE BatchMealForm SHALL mặc định tất cả checkbox bữa ăn của tất cả thành viên là chưa chọn khi nhóm được chọn lần đầu.
4. WHEN người dùng thay đổi checkbox bữa ăn của một thành viên, THE BatchMealForm SHALL cập nhật tổng tiền của thành viên đó ngay lập tức.
5. THE BatchMealForm SHALL tính và hiển thị tổng tiền của từng thành viên dựa trên các bữa ăn đã chọn, giá hiện tại và hệ số ngày lễ.

---

### Yêu Cầu 4: Thao Tác Hàng Loạt (Bulk Actions)

**User Story:** Là người dùng, tôi muốn chọn hoặc bỏ chọn tất cả bữa ăn cùng loại cho cả nhóm chỉ với một thao tác, để tôi tiết kiệm thời gian khi hầu hết mọi người ăn cùng bữa.

#### Tiêu Chí Chấp Nhận

1. THE BatchMealForm SHALL hiển thị checkbox "chọn tất cả" ở hàng tiêu đề cho mỗi cột bữa ăn (Sáng, Trưa, Chiều).
2. WHEN người dùng tích vào checkbox "chọn tất cả Sáng", THE BatchMealForm SHALL đánh dấu bữa sáng cho tất cả thành viên trong nhóm.
3. WHEN người dùng bỏ tích checkbox "chọn tất cả Sáng", THE BatchMealForm SHALL bỏ đánh dấu bữa sáng cho tất cả thành viên trong nhóm.
4. WHEN người dùng tích vào checkbox "chọn tất cả Trưa", THE BatchMealForm SHALL đánh dấu bữa trưa cho tất cả thành viên trong nhóm.
5. WHEN người dùng bỏ tích checkbox "chọn tất cả Trưa", THE BatchMealForm SHALL bỏ đánh dấu bữa trưa cho tất cả thành viên trong nhóm.
6. WHEN người dùng tích vào checkbox "chọn tất cả Chiều", THE BatchMealForm SHALL đánh dấu bữa chiều cho tất cả thành viên trong nhóm.
7. WHEN người dùng bỏ tích checkbox "chọn tất cả Chiều", THE BatchMealForm SHALL bỏ đánh dấu bữa chiều cho tất cả thành viên trong nhóm.
8. WHEN tất cả thành viên đã được chọn một bữa ăn cụ thể, THE BatchMealForm SHALL hiển thị checkbox "chọn tất cả" tương ứng ở trạng thái đã tích.
9. WHEN chỉ một số (không phải tất cả) thành viên được chọn một bữa ăn cụ thể, THE BatchMealForm SHALL hiển thị checkbox "chọn tất cả" tương ứng ở trạng thái indeterminate.

---

### Yêu Cầu 5: Lưu Hàng Loạt

**User Story:** Là người dùng, tôi muốn lưu bản ghi bữa ăn cho tất cả thành viên trong nhóm chỉ với một lần nhấn nút, để tôi không phải lưu từng người một.

#### Tiêu Chí Chấp Nhận

1. THE BatchMealForm SHALL hiển thị nút "Lưu tất cả" khi một nhóm có thành viên (DQTT hoặc Cán bộ) đang được hiển thị.
2. WHEN người dùng nhấn "Lưu tất cả", THE BatchMealForm SHALL lưu bản ghi bữa ăn cho tất cả thành viên trong nhóm vào Google Sheets.
3. WHEN người dùng nhấn "Lưu tất cả", THE BatchMealForm SHALL chỉ lưu bản ghi cho các thành viên có ít nhất một bữa ăn được chọn.
4. WHILE đang lưu dữ liệu, THE BatchMealForm SHALL hiển thị trạng thái "Đang lưu..." và vô hiệu hóa nút "Lưu tất cả".
5. WHEN tất cả bản ghi được lưu thành công, THE BatchMealForm SHALL hiển thị thông báo thành công "Đã lưu X bản ghi thành công!" (X là số bản ghi đã lưu).
6. IF không có thành viên nào được chọn ít nhất một bữa ăn, THEN THE BatchMealForm SHALL hiển thị thông báo lỗi "Vui lòng chọn ít nhất một bữa ăn" và không thực hiện lưu.
7. IF một hoặc nhiều bản ghi không thể lưu được, THEN THE BatchMealForm SHALL hiển thị thông báo lỗi nêu rõ số bản ghi thất bại và cho phép người dùng thử lại.
8. WHEN lưu thành công, THE BatchMealForm SHALL giữ nguyên cài đặt chung (ngày, giá, hệ số) nhưng đặt lại tất cả checkbox bữa ăn về trạng thái chưa chọn.

---

### Yêu Cầu 6: Tích Hợp Với Hệ Thống Hiện Có

**User Story:** Là nhà phát triển, tôi muốn tính năng chấm cơm theo mẫu tái sử dụng logic hiện có, để đảm bảo tính nhất quán và tránh trùng lặp code.

#### Tiêu Chí Chấp Nhận

1. THE BatchMealForm SHALL sử dụng hàm `calculateTotal` từ `lib/calculations.ts` để tính tổng tiền cho từng thành viên.
2. THE BatchMealForm SHALL sử dụng server action `saveMealRecord` từ `app/actions.ts` để lưu từng bản ghi vào Google Sheets.
3. THE BatchMealForm SHALL sử dụng hàm `validateDate` và `validatePrice` từ `lib/validation.ts` để kiểm tra cài đặt chung trước khi lưu.
4. THE BatchMealForm SHALL lưu dữ liệu theo cùng định dạng với form cá nhân hiện có (MealRecord trong GoogleSheetsService).
5. WHEN lưu hàng loạt, THE BatchMealForm SHALL gọi `saveMealRecord` tuần tự cho từng thành viên có bữa ăn được chọn.
