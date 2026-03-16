# Yêu cầu: Ứng dụng Chấm Cơm Công Ty

## 1. Tổng quan
Xây dựng ứng dụng web đơn giản cho phép nhân viên chấm cơm hàng ngày, tự động tính toán chi phí và đồng bộ dữ liệu lên Google Sheets.

## 2. Mục tiêu
- Đơn giản hóa quy trình chấm cơm cho nhân viên
- Tự động tính toán chi phí bữa ăn
- Đồng bộ dữ liệu real-time với Google Sheets
- Dễ dàng deploy và bảo trì

## 3. Phạm vi dự án

### 3.1 Trong phạm vi
- Form nhập liệu chấm cơm
- Tính toán tự động chi phí
- Tích hợp Google Sheets API
- Giao diện tiếng Việt
- Deploy lên Vercel

### 3.2 Ngoài phạm vi
- Quản lý người dùng/đăng nhập
- Báo cáo thống kê
- Lịch sử chấm cơm
- Quản lý menu

## 4. Yêu cầu chức năng

### 4.1 Form chấm cơm
**Mô tả**: Giao diện cho phép nhân viên nhập thông tin chấm cơm

**Acceptance Criteria**:
- Form hiển thị các trường: Ngày, Tên Nhân Viên, Sáng, Trưa, Chiều
- Sáng, Trưa, Chiều là checkbox (chọn = 1, không chọn = 0)
- Ngày mặc định là ngày hiện tại, có thể chỉnh sửa
- Tên nhân viên là text input
- Form validation: Ngày và Tên nhân viên là bắt buộc

### 4.2 Cấu hình giá bữa ăn
**Mô tả**: Cho phép cấu hình giá cho từng bữa ăn

**Acceptance Criteria**:
- Hiển thị 3 trường nhập giá: Sáng, Trưa, Chiều
- Giá mặc định: Sáng = 12.000đ, Trưa = 30.000đ, Chiều = 30.000đ
- Người dùng có thể chỉnh sửa giá trước khi lưu
- Giá phải là số dương

### 4.3 Hệ số ngày lễ
**Mô tả**: Áp dụng hệ số nhân cho ngày lễ

**Acceptance Criteria**:
- Checkbox "Ngày lễ"
- Nếu chọn: Hệ số = 2
- Nếu không chọn: Hệ số = 1 (mặc định)
- Hệ số được sử dụng để tính tổng cộng

### 4.4 Tính toán tự động
**Mô tả**: Tự động tính tổng chi phí

**Acceptance Criteria**:
- Công thức: Tổng = (Giá_Sáng × Sáng + Giá_Trưa × Trưa + Giá_Chiều × Chiều) × Hệ_số
- Hiển thị tổng cộng real-time khi người dùng thay đổi input
- Định dạng số tiền: 72.000đ (có dấu chấm phân cách hàng nghìn)

### 4.5 Tích hợp Google Sheets
**Mô tả**: Lưu dữ liệu lên Google Sheets

**Acceptance Criteria**:
- Kết nối với Google Sheets API
- URL sheet: https://docs.google.com/spreadsheets/d/1bn9mGEME4gb5wUNZ0riAgvbwn65gvJvKNJyz8BFxOxw/edit?gid=1685564899
- Cấu trúc dữ liệu: ID | Ngày | Tên Nhân Viên | Sáng | Trưa | Chiều | Hệ số | Tổng cộng
- ID tự động tăng (lấy từ số dòng cuối cùng + 1)
- Ngày định dạng: DD/MM/YYYY
- Sáng, Trưa, Chiều lưu giá trị 0 hoặc 1
- Tổng cộng lưu dạng số (không có đơn vị)
- Hiển thị thông báo thành công/thất bại sau khi lưu

### 4.6 Nút lưu dữ liệu
**Mô tả**: Nút để submit form và lưu lên Google Sheets

**Acceptance Criteria**:
- Nút "Lưu" hiển thị rõ ràng
- Validate form trước khi gửi
- Hiển thị loading state khi đang lưu
- Hiển thị thông báo kết quả (thành công/lỗi)
- Reset form sau khi lưu thành công

## 5. Yêu cầu phi chức năng

### 5.1 Công nghệ
- Framework: Next.js (App Router hoặc Pages Router)
- Styling: Tailwind CSS hoặc CSS modules
- Google Sheets API: googleapis package
- Deploy: Vercel

### 5.2 Hiệu năng
- Thời gian load trang < 2 giây
- Thời gian lưu dữ liệu < 3 giây

### 5.3 Giao diện người dùng
- Giao diện đơn giản, dễ sử dụng
- Responsive trên mobile và desktop
- Tất cả text hiển thị bằng tiếng Việt
- Màu sắc và font chữ dễ đọc

### 5.4 Bảo mật
- API credentials được lưu trong biến môi trường (.env)
- Không expose sensitive data ra client
- HTTPS khi deploy production

### 5.5 Khả năng mở rộng
- Code structure rõ ràng, dễ maintain
- Component-based architecture
- Có thể thêm tính năng mới sau này

## 6. Ví dụ dữ liệu

### Ví dụ 1:
- Ngày: 13/03/2026
- Tên: Nguyễn Văn A
- Sáng: ✓ (12.000đ)
- Trưa: ✓ (30.000đ)
- Chiều: ✓ (30.000đ)
- Ngày lễ: ✗ (Hệ số = 1)
- **Tổng cộng: 72.000đ**

### Ví dụ 2:
- Ngày: 13/03/2026
- Tên: Trần Thị B
- Sáng: ✗
- Trưa: ✓ (30.000đ)
- Chiều: ✓ (28.000đ - đã chỉnh sửa)
- Ngày lễ: ✗ (Hệ số = 1)
- **Tổng cộng: 58.000đ**

### Ví dụ 3 (Ngày lễ):
- Ngày: 30/04/2026
- Tên: Lê Văn C
- Sáng: ✓ (12.000đ)
- Trưa: ✓ (30.000đ)
- Chiều: ✗
- Ngày lễ: ✓ (Hệ số = 2)
- **Tổng cộng: 84.000đ** (42.000 × 2)

## 7. Cấu trúc Google Sheets

### Cột trong sheet:
1. **ID**: Số thứ tự tự động tăng (1, 2, 3, ...)
2. **Ngày**: Định dạng DD/MM/YYYY (ví dụ: 13/03/2026)
3. **Tên Nhân Viên**: Text (ví dụ: Nguyễn Văn A)
4. **Sáng**: Số 0 hoặc 1 (0 = không ăn, 1 = có ăn)
5. **Trưa**: Số 0 hoặc 1
6. **Chiều**: Số 0 hoặc 1
7. **Hệ số**: Số 1 hoặc 2 (1 = ngày thường, 2 = ngày lễ)
8. **Tổng cộng**: Số tiền (ví dụ: 72000) - không có dấu chấm phân cách

### Lưu ý:
- Sheet ID: 1685564899
- Spreadsheet ID: 1bn9mGEME4gb5wUNZ0riAgvbwn65gvJvKNJyz8BFxOxw
- Dữ liệu được append vào cuối sheet (không ghi đè)

## 8. Quy trình sử dụng

1. Người dùng mở ứng dụng
2. Nhập tên nhân viên
3. Chọn ngày (mặc định là hôm nay)
4. Tick checkbox cho các bữa ăn (Sáng/Trưa/Chiều)
5. Xem/chỉnh sửa giá từng bữa nếu cần
6. Tick "Ngày lễ" nếu là ngày lễ
7. Xem tổng cộng được tính tự động
8. Nhấn nút "Lưu"
9. Hệ thống lưu dữ liệu lên Google Sheets
10. Hiển thị thông báo thành công
11. Form được reset để nhập dữ liệu mới
