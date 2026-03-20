# Tài Liệu Yêu Cầu

## Giới Thiệu

Tính năng "Chấm Cơm Theo Khoảng Ngày" mở rộng ứng dụng "Chấm Cơm Cơ Quan" hiện có, cho phép người dùng chấm cơm cho một khoảng ngày (từ ngày A đến ngày B) thay vì chỉ một ngày đơn lẻ. Tính năng hỗ trợ hai chế độ: **Đồng nhất** (cùng lựa chọn bữa ăn áp dụng cho tất cả các ngày trong khoảng) và **Không đồng nhất** (mỗi ngày có thể cấu hình bữa ăn và hệ số ngày lễ riêng). Kết quả lưu tạo ra một bản ghi cho mỗi thành viên cho mỗi ngày trong khoảng.

## Bảng Thuật Ngữ

- **DateRangeMealForm**: Giao diện chấm cơm theo khoảng ngày
- **DateRangeMode**: Chế độ nhập liệu — `single` (một ngày, hiện có) hoặc `range` (khoảng ngày, mới)
- **UniformMode**: Chế độ đồng nhất — cùng lựa chọn bữa ăn áp dụng cho tất cả các ngày
- **NonUniformMode**: Chế độ không đồng nhất — mỗi ngày có cấu hình bữa ăn và hệ số ngày lễ riêng
- **DayConfig**: Cấu hình bữa ăn cho một ngày cụ thể trong chế độ không đồng nhất, bao gồm danh sách bữa ăn của từng thành viên và cờ ngày lễ
- **RangeSettings**: Cài đặt chung cho khoảng ngày: startDate, endDate, giá các bữa ăn
- **MealRecord**: Bản ghi bữa ăn của một nhân viên trong một ngày, được lưu vào Google Sheets
- **RecordCount**: Tổng số bản ghi sẽ được tạo = số thành viên có bữa ăn × số ngày trong khoảng
- **BatchMealForm**: Component chấm cơm theo mẫu hiện có (không thay đổi)

---

## Yêu Cầu

### Yêu Cầu 1: Chuyển Đổi Giữa Chế Độ Một Ngày Và Khoảng Ngày

**User Story:** Là người dùng, tôi muốn chuyển đổi giữa chế độ chấm cơm một ngày và khoảng ngày, để tôi có thể linh hoạt sử dụng tính năng phù hợp với nhu cầu.

#### Tiêu Chí Chấp Nhận

1. THE DateRangeMealForm SHALL hiển thị hai lựa chọn chế độ: "Một ngày" và "Khoảng ngày".
2. THE DateRangeMealForm SHALL mặc định ở chế độ "Một ngày" khi trang được tải lần đầu.
3. WHEN người dùng chọn chế độ "Một ngày", THE DateRangeMealForm SHALL hiển thị giao diện chấm cơm một ngày hiện có (BatchMealForm).
4. WHEN người dùng chọn chế độ "Khoảng ngày", THE DateRangeMealForm SHALL hiển thị giao diện chấm cơm theo khoảng ngày.
5. WHEN người dùng chuyển đổi chế độ, THE DateRangeMealForm SHALL đặt lại toàn bộ trạng thái nhập liệu về giá trị mặc định.

---

### Yêu Cầu 2: Nhập Khoảng Ngày Và Cài Đặt Chung

**User Story:** Là người dùng, tôi muốn nhập ngày bắt đầu, ngày kết thúc và giá các bữa ăn một lần cho cả khoảng ngày, để tôi không phải nhập lại thông tin này cho từng ngày.

#### Tiêu Chí Chấp Nhận

1. THE DateRangeMealForm SHALL hiển thị trường "Từ ngày" (startDate) và "Đến ngày" (endDate) khi ở chế độ khoảng ngày.
2. THE DateRangeMealForm SHALL hiển thị các trường giá bữa sáng, giá bữa trưa, giá bữa chiều áp dụng cho toàn bộ khoảng ngày.
3. THE DateRangeMealForm SHALL mặc định startDate và endDate là ngày hiện tại theo định dạng YYYY-MM-DD.
4. THE DateRangeMealForm SHALL mặc định giá bữa sáng là 12.000đ, giá bữa trưa là 30.000đ, giá bữa chiều là 30.000đ.
5. IF người dùng nhập endDate trước startDate, THEN THE DateRangeMealForm SHALL hiển thị thông báo lỗi "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu" và ngăn không cho lưu.
6. IF người dùng nhập khoảng ngày vượt quá 31 ngày, THEN THE DateRangeMealForm SHALL hiển thị thông báo lỗi "Khoảng ngày tối đa là 31 ngày" và ngăn không cho lưu.
7. IF người dùng nhập ngày không hợp lệ (không qua `validateDate`), THEN THE DateRangeMealForm SHALL hiển thị thông báo lỗi "Vui lòng chọn ngày hợp lệ" và ngăn không cho lưu.
8. IF người dùng nhập giá không hợp lệ (không qua `validatePrice`), THEN THE DateRangeMealForm SHALL hiển thị thông báo lỗi tương ứng và ngăn không cho lưu.

---

### Yêu Cầu 3: Chọn Nhóm Và Chế Độ Đồng Nhất / Không Đồng Nhất

**User Story:** Là người dùng, tôi muốn chọn nhóm nhân viên và chế độ chấm cơm (đồng nhất hoặc không đồng nhất), để tôi có thể cấu hình phù hợp với thực tế của từng khoảng ngày.

#### Tiêu Chí Chấp Nhận

1. THE DateRangeMealForm SHALL hiển thị bộ chọn nhóm (DQTT, Cán bộ, Cán bộ xã) khi ở chế độ khoảng ngày.
2. THE DateRangeMealForm SHALL hiển thị hai lựa chọn chế độ chấm cơm: "Đồng nhất" và "Không đồng nhất" sau khi nhóm được chọn.
3. THE DateRangeMealForm SHALL mặc định ở chế độ "Đồng nhất" khi nhóm được chọn lần đầu.
4. WHEN người dùng chọn nhóm, THE DateRangeMealForm SHALL hiển thị danh sách thành viên của nhóm đó theo dữ liệu từ `GROUP_TEMPLATES`.
5. WHEN người dùng thay đổi nhóm, THE DateRangeMealForm SHALL đặt lại toàn bộ trạng thái bữa ăn về giá trị mặc định.

---

### Yêu Cầu 4: Chế Độ Đồng Nhất (Uniform)

**User Story:** Là người dùng, tôi muốn chọn bữa ăn một lần và áp dụng cho tất cả các ngày trong khoảng, để tôi tiết kiệm thời gian khi lịch ăn không thay đổi.

#### Tiêu Chí Chấp Nhận

1. WHEN người dùng chọn chế độ "Đồng nhất", THE DateRangeMealForm SHALL hiển thị một bảng chấm cơm duy nhất với danh sách thành viên của nhóm đã chọn.
2. THE DateRangeMealForm SHALL hiển thị checkbox "chọn tất cả" ở hàng tiêu đề cho mỗi cột bữa ăn (Sáng, Trưa, Chiều) trong chế độ đồng nhất.
3. WHEN người dùng thay đổi checkbox bữa ăn của một thành viên trong chế độ đồng nhất, THE DateRangeMealForm SHALL cập nhật tổng số bản ghi sẽ lưu ngay lập tức.
4. THE DateRangeMealForm SHALL hiển thị thông báo "Sẽ lưu X bản ghi" trong đó X = số thành viên có ít nhất một bữa ăn × số ngày trong khoảng.
5. WHEN người dùng nhấn "Lưu tất cả" trong chế độ đồng nhất, THE DateRangeMealForm SHALL tạo một bản ghi cho mỗi thành viên có bữa ăn cho mỗi ngày trong khoảng.

---

### Yêu Cầu 5: Chế Độ Không Đồng Nhất (Non-Uniform)

**User Story:** Là người dùng, tôi muốn cấu hình bữa ăn và hệ số ngày lễ riêng cho từng ngày trong khoảng, để tôi có thể phản ánh chính xác thực tế khi lịch ăn thay đổi theo ngày.

#### Tiêu Chí Chấp Nhận

1. WHEN người dùng chọn chế độ "Không đồng nhất", THE DateRangeMealForm SHALL hiển thị danh sách các ngày trong khoảng, mỗi ngày là một mục có thể mở rộng (expandable).
2. WHEN người dùng mở rộng một ngày, THE DateRangeMealForm SHALL hiển thị bảng chấm cơm cho ngày đó với danh sách thành viên của nhóm đã chọn.
3. THE DateRangeMealForm SHALL hiển thị checkbox "Ngày lễ (Hệ số x2)" riêng cho từng ngày trong chế độ không đồng nhất.
4. WHEN người dùng bật checkbox "Ngày lễ" cho một ngày, THE DateRangeMealForm SHALL áp dụng hệ số nhân 2 chỉ cho ngày đó khi tính tổng tiền.
5. THE DateRangeMealForm SHALL hiển thị thông báo "Sẽ lưu X bản ghi" trong đó X = tổng số cặp (thành viên có bữa ăn, ngày) trên tất cả các ngày đã cấu hình.
6. WHEN người dùng nhấn "Lưu tất cả" trong chế độ không đồng nhất, THE DateRangeMealForm SHALL tạo bản ghi cho từng cặp (thành viên có bữa ăn, ngày) với hệ số ngày lễ tương ứng của ngày đó.
7. THE DateRangeMealForm SHALL mặc định tất cả checkbox bữa ăn của tất cả thành viên là chưa chọn và checkbox ngày lễ là chưa chọn cho mỗi ngày khi chế độ không đồng nhất được kích hoạt.

---

### Yêu Cầu 6: Hiển Thị Số Bản Ghi Và Xác Nhận Trước Khi Lưu

**User Story:** Là người dùng, tôi muốn biết trước số bản ghi sẽ được tạo trước khi nhấn lưu, để tôi có thể kiểm tra lại trước khi ghi vào Google Sheets.

#### Tiêu Chí Chấp Nhận

1. THE DateRangeMealForm SHALL hiển thị thông báo "Sẽ lưu X bản ghi" được cập nhật theo thời gian thực khi người dùng thay đổi lựa chọn bữa ăn.
2. WHEN X bằng 0, THE DateRangeMealForm SHALL hiển thị thông báo "Chưa có bữa ăn nào được chọn" thay vì "Sẽ lưu 0 bản ghi".
3. WHEN người dùng nhấn "Lưu tất cả" và X bằng 0, THE DateRangeMealForm SHALL ngăn không cho lưu và hiển thị thông báo lỗi "Vui lòng chọn ít nhất một bữa ăn".
4. WHILE đang lưu dữ liệu, THE DateRangeMealForm SHALL hiển thị trạng thái "Đang lưu..." và vô hiệu hóa nút "Lưu tất cả".
5. WHEN tất cả bản ghi được lưu thành công, THE DateRangeMealForm SHALL hiển thị thông báo thành công "Đã lưu X bản ghi thành công!".
6. IF một hoặc nhiều bản ghi không thể lưu được, THEN THE DateRangeMealForm SHALL hiển thị thông báo lỗi nêu rõ số bản ghi thất bại và cho phép người dùng thử lại.

---

### Yêu Cầu 7: Tạo Và Lưu Bản Ghi Theo Khoảng Ngày

**User Story:** Là nhà phát triển, tôi muốn hệ thống tạo đúng số lượng bản ghi với đúng dữ liệu cho từng ngày trong khoảng, để đảm bảo tính chính xác của dữ liệu trong Google Sheets.

#### Tiêu Chí Chấp Nhận

1. THE DateRangeMealForm SHALL tạo danh sách các ngày trong khoảng [startDate, endDate] bao gồm cả hai đầu mút, mỗi ngày cách nhau đúng 1 ngày dương lịch.
2. WHEN lưu ở chế độ đồng nhất, THE DateRangeMealForm SHALL gọi `saveMealRecords` với danh sách bản ghi gồm tất cả cặp (thành viên có bữa ăn, ngày) trong khoảng.
3. WHEN lưu ở chế độ không đồng nhất, THE DateRangeMealForm SHALL gọi `saveMealRecords` với danh sách bản ghi gồm tất cả cặp (thành viên có bữa ăn, ngày) với hệ số ngày lễ tương ứng của từng ngày.
4. THE DateRangeMealForm SHALL sử dụng hàm `calculateTotal` từ `lib/calculations.ts` để tính tổng tiền cho từng bản ghi.
5. THE DateRangeMealForm SHALL sử dụng hàm `validateDate` và `validatePrice` từ `lib/validation.ts` để kiểm tra dữ liệu trước khi lưu.
6. THE DateRangeMealForm SHALL lưu dữ liệu theo cùng định dạng `MealFormData` với server action `saveMealRecords` hiện có.
7. WHEN lưu thành công, THE DateRangeMealForm SHALL đặt lại tất cả checkbox bữa ăn về trạng thái chưa chọn nhưng giữ nguyên khoảng ngày, giá và nhóm đã chọn.

---

### Yêu Cầu 8: Tạo Danh Sách Ngày Từ Khoảng Ngày

**User Story:** Là nhà phát triển, tôi muốn có một hàm tiện ích tạo danh sách ngày từ khoảng ngày, để đảm bảo logic tạo ngày nhất quán và có thể kiểm thử độc lập.

#### Tiêu Chí Chấp Nhận

1. THE DateRangeUtils SHALL cung cấp hàm `generateDateRange(startDate, endDate)` trả về mảng các chuỗi ngày theo định dạng YYYY-MM-DD.
2. WHEN startDate bằng endDate, THE DateRangeUtils SHALL trả về mảng chứa đúng một phần tử là ngày đó.
3. WHEN startDate trước endDate, THE DateRangeUtils SHALL trả về mảng các ngày liên tiếp từ startDate đến endDate, bao gồm cả hai đầu mút.
4. THE DateRangeUtils SHALL đảm bảo mảng kết quả được sắp xếp theo thứ tự tăng dần (ngày sớm hơn trước).
5. IF startDate sau endDate, THEN THE DateRangeUtils SHALL trả về mảng rỗng.
