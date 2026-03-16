# Thiết kế: Ứng dụng Chấm Cơm Công Ty

## Tổng quan

Ứng dụng web đơn giản cho phép nhân viên chấm cơm hàng ngày với tính năng tự động tính toán chi phí và đồng bộ dữ liệu lên Google Sheets. Ứng dụng được xây dựng bằng Next.js, deploy trên Vercel, và sử dụng Google Sheets API để lưu trữ dữ liệu.

### Các quyết định thiết kế chính

1. **Next.js với App Router**: Sử dụng App Router để tận dụng Server Components và Server Actions, giúp xử lý Google Sheets API an toàn phía server
2. **Server Actions cho Google Sheets**: Tất cả tương tác với Google Sheets API được thực hiện qua Server Actions để bảo vệ credentials
3. **Client-side calculation**: Tính toán tổng chi phí được thực hiện real-time trên client để UX mượt mà
4. **Single-page application**: Toàn bộ chức năng trên một trang duy nhất để đơn giản hóa UX
5. **Tailwind CSS**: Sử dụng Tailwind để styling nhanh chóng và responsive

## Kiến trúc

### Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              MealForm Component                        │ │
│  │  - Form inputs (date, name, checkboxes, prices)       │ │
│  │  - Real-time calculation                              │ │
│  │  - Form validation                                     │ │
│  │  - Submit handler                                      │ │
│  └────────────────┬───────────────────────────────────────┘ │
│                   │                                          │
│                   │ Server Action call                       │
│                   ▼                                          │
└─────────────────────────────────────────────────────────────┘
                    │
                    │ HTTPS
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server (Vercel)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Server Action: saveMealRecord()              │ │
│  │  - Validate input data                                 │ │
│  │  - Format data for Google Sheets                      │ │
│  │  - Call Google Sheets service                         │ │
│  └────────────────┬───────────────────────────────────────┘ │
│                   │                                          │
│  ┌────────────────▼───────────────────────────────────────┐ │
│  │         GoogleSheetsService                            │ │
│  │  - Initialize Google Sheets API client                │ │
│  │  - Authenticate with service account                  │ │
│  │  - Append row to sheet                                │ │
│  │  - Get next ID                                        │ │
│  └────────────────┬───────────────────────────────────────┘ │
└────────────────────┼───────────────────────────────────────┘
                     │
                     │ Google Sheets API
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Google Sheets                           │
│  Sheet ID: 1685564899                                        │
│  Columns: ID | Ngày | Tên | Sáng | Trưa | Chiều | Hệ số |  │
│           Tổng cộng                                          │
└─────────────────────────────────────────────────────────────┘
```

### Luồng dữ liệu

1. **Nhập liệu → Kiểm tra phía Client**
   - Người dùng điền form → Client kiểm tra các trường bắt buộc
   - Người dùng thay đổi input → Client tính lại tổng theo thời gian thực

2. **Gửi → Server Action**
   - Người dùng nhấn "Lưu" → Dữ liệu form được gửi đến Server Action
   - Server Action kiểm tra dữ liệu lại lần nữa (phòng thủ nhiều lớp)

3. **Server Action → Google Sheets Service**
   - Server Action định dạng dữ liệu → Gọi GoogleSheetsService
   - Service xác thực → Thêm dòng vào sheet

4. **Phản hồi → Thông báo cho người dùng**
   - Thành công → Hiển thị thông báo thành công, reset form
   - Lỗi → Hiển thị thông báo lỗi, giữ nguyên dữ liệu form

## Các thành phần và giao diện

### Các thành phần Frontend

#### 1. MealForm Component (Client Component)

**Mục đích**: Component form chính để nhập liệu chấm cơm

**Quản lý State**:
```typescript
interface MealFormState {
  date: string;              // Format: YYYY-MM-DD (HTML date input)
  employeeName: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  breakfastPrice: number;    // Default: 12000
  lunchPrice: number;        // Default: 30000
  dinnerPrice: number;       // Default: 30000
  isHoliday: boolean;
  isSubmitting: boolean;
}
```

**Các phương thức chính**:
- `calculateTotal()`: Tính tổng chi phí dựa trên state hiện tại
- `handleSubmit()`: Kiểm tra và gửi form đến Server Action
- `resetForm()`: Reset form về giá trị mặc định
- `validateForm()`: Kiểm tra phía client

**Props**: Không có (component gốc)

#### 2. PriceInput Component (Client Component)

**Mục đích**: Input có thể tái sử dụng cho các trường giá với định dạng tiền tệ Việt Nam

**Props**:
```typescript
interface PriceInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}
```

**Tính năng**:
- Định dạng hiển thị với dấu phân cách hàng nghìn (72.000đ)
- Chỉ chấp nhận số dương
- Xử lý nhập liệu tiền tệ Việt Nam

#### 3. TotalDisplay Component (Client Component)

**Mục đích**: Hiển thị tổng đã tính toán với định dạng

**Props**:
```typescript
interface TotalDisplayProps {
  total: number;
}
```

**Tính năng**:
- Định dạng số với dấu phân cách hàng nghìn
- Hiển thị hậu tố "đ"
- Styling nổi bật để dễ nhìn

### Các dịch vụ Backend

#### 1. GoogleSheetsService

**Mục đích**: Xử lý tất cả tương tác với Google Sheets API

**Giao diện**:
```typescript
class GoogleSheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetId: string;
  private sheetId: string;
  
  constructor();
  
  /**
   * Appends a new meal record to the sheet
   * @param record - The meal record to append
   * @returns Promise<{ success: boolean; id: number }>
   */
  async appendMealRecord(record: MealRecord): Promise<AppendResult>;
  
  /**
   * Gets the next available ID by counting existing rows
   * @returns Promise<number>
   */
  private async getNextId(): Promise<number>;
  
  /**
   * Initializes Google Sheets API client with service account
   */
  private initializeClient(): void;
}
```

**Cấu hình**:
- Spreadsheet ID: `1bn9mGEME4gb5wUNZ0riAgvbwn65gvJvKNJyz8BFxOxw`
- Sheet ID: `1685564899`
- Xác thực: Service Account (thông tin xác thực từ biến môi trường)

**Xử lý lỗi**:
- Lỗi mạng → Thử lại với exponential backoff (tối đa 3 lần)
- Lỗi xác thực → Trả về thông báo lỗi rõ ràng
- Lỗi dữ liệu không hợp lệ → Kiểm tra trước khi gửi

#### 2. Server Action: saveMealRecord

**Mục đích**: Endpoint phía server để lưu bản ghi chấm cơm

**Giao diện**:
```typescript
async function saveMealRecord(data: MealFormData): Promise<SaveResult> {
  // 1. Validate input data
  // 2. Calculate total on server (verify client calculation)
  // 3. Format data for Google Sheets
  // 4. Call GoogleSheetsService
  // 5. Return result
}

interface MealFormData {
  date: string;              // YYYY-MM-DD
  employeeName: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  breakfastPrice: number;
  lunchPrice: number;
  dinnerPrice: number;
  isHoliday: boolean;
}

interface SaveResult {
  success: boolean;
  message: string;
  id?: number;               // ID of created record
  error?: string;
}
```

**Quy tắc kiểm tra**:
- `date`: Bắt buộc, định dạng ngày hợp lệ
- `employeeName`: Bắt buộc, chuỗi không rỗng, đã trim
- Prices: Chỉ số dương
- Trường boolean: Phải là kiểu boolean

## Mô hình dữ liệu

### MealRecord (Dòng Google Sheets)

**Mục đích**: Đại diện cho một bản ghi chấm cơm trong Google Sheets

**Cấu trúc**:
```typescript
interface MealRecord {
  id: number;                // Auto-increment, starts from 1
  date: string;              // Format: DD/MM/YYYY
  employeeName: string;      // Employee name
  breakfast: 0 | 1;          // 0 = not selected, 1 = selected
  lunch: 0 | 1;
  dinner: 0 | 1;
  multiplier: 1 | 2;         // 1 = regular day, 2 = holiday
  total: number;             // Total cost (no formatting, raw number)
}
```

**Ánh xạ từ Form sang Sheet**:
```typescript
function formDataToSheetRow(formData: MealFormData, id: number): MealRecord {
  const breakfast = formData.breakfast ? 1 : 0;
  const lunch = formData.lunch ? 1 : 0;
  const dinner = formData.dinner ? 1 : 0;
  const multiplier = formData.isHoliday ? 2 : 1;
  
  const total = (
    (breakfast * formData.breakfastPrice) +
    (lunch * formData.lunchPrice) +
    (dinner * formData.dinnerPrice)
  ) * multiplier;
  
  return {
    id,
    date: formatDateToDDMMYYYY(formData.date),
    employeeName: formData.employeeName.trim(),
    breakfast,
    lunch,
    dinner,
    multiplier,
    total
  };
}
```

### Cấu hình môi trường

**Mục đích**: Lưu trữ thông tin xác thực nhạy cảm và cấu hình

**Các biến môi trường bắt buộc**:
```bash
# Google Service Account Credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=1bn9mGEME4gb5wUNZ0riAgvbwn65gvJvKNJyz8BFxOxw
GOOGLE_SHEET_ID=1685564899
```

**Lưu ý bảo mật**:
- Không bao giờ commit file `.env` vào version control
- Sử dụng biến môi trường Vercel cho production
- Private key phải bao gồm ký tự xuống dòng (`\n`)


## Các thuộc tính đúng đắn

*Một thuộc tính là một đặc điểm hoặc hành vi phải đúng trong tất cả các lần thực thi hợp lệ của hệ thống—về cơ bản, là một tuyên bố chính thức về những gì hệ thống nên làm. Các thuộc tính đóng vai trò là cầu nối giữa các đặc tả có thể đọc được bởi con người và các đảm bảo tính đúng đắn có thể xác minh bằng máy.*

### Thuộc tính 1: Tính toán tổng chi phí

*Với bất kỳ* tổ hợp lựa chọn bữa ăn (sáng, trưa, chiều), giá cả và hệ số ngày lễ, tổng được tính phải bằng: (sáng_chọn × giá_sáng + trưa_chọn × giá_trưa + chiều_chọn × giá_chiều) × hệ_số

**Kiểm tra: Yêu cầu 4.4.1**

### Thuộc tính 2: Kiểm tra trường bắt buộc

*Với bất kỳ* lần gửi form, nếu trường ngày trống HOẶC trường tên nhân viên trống, việc gửi phải bị từ chối với lỗi kiểm tra

**Kiểm tra: Yêu cầu 4.1.5**

### Thuộc tính 3: Kiểm tra giá dương

*Với bất kỳ* input giá (sáng, trưa, hoặc chiều), nếu giá trị nhỏ hơn hoặc bằng 0, input phải bị từ chối hoặc ngăn chặn

**Kiểm tra: Yêu cầu 4.2.4**

### Thuộc tính 4: Chuyển đổi Checkbox sang nhị phân

*Với bất kỳ* trạng thái checkbox (sáng, trưa, chiều), khi dữ liệu form được chuẩn bị để lưu, checkbox được chọn phải được chuyển thành 1 và checkbox không chọn phải được chuyển thành 0

**Kiểm tra: Yêu cầu 4.1.2, 4.5.6**

### Thuộc tính 5: Định dạng tiền tệ

*Với bất kỳ* số dương đại diện cho số tiền, khi hiển thị cho người dùng, nó phải được định dạng với dấu phân cách hàng nghìn (dấu chấm) và hậu tố "đ" (ví dụ: 72.000đ)

**Kiểm tra: Yêu cầu 4.4.3**

### Thuộc tính 6: Tuần tự hóa dữ liệu cho Google Sheets

*Với bất kỳ* bản ghi chấm cơm hợp lệ, khi được tuần tự hóa cho Google Sheets, nó phải chứa chính xác 8 trường theo thứ tự: ID (số), Ngày (chuỗi DD/MM/YYYY), Tên Nhân Viên (chuỗi), Sáng (0 hoặc 1), Trưa (0 hoặc 1), Chiều (0 hoặc 1), Hệ số (1 hoặc 2), Tổng cộng (số không định dạng)

**Kiểm tra: Yêu cầu 4.5.3, 4.5.5, 4.5.7**

### Thuộc tính 7: ID tự động tăng

*Với bất kỳ* chuỗi bản ghi chấm cơm được lưu vào Google Sheets, ID của mỗi bản ghi mới phải lớn hơn đúng 1 so với ID của bản ghi trước đó

**Kiểm tra: Yêu cầu 4.5.4**

### Thuộc tính 8: Cập nhật tổng theo thời gian thực

*Với bất kỳ* thay đổi đối với input form (lựa chọn bữa ăn, giá cả, hoặc checkbox ngày lễ), tổng hiển thị phải cập nhật ngay lập tức để phản ánh phép tính mới

**Kiểm tra: Yêu cầu 4.4.2**

### Thuộc tính 9: Kiểm tra form trước khi gửi

*Với bất kỳ* nỗ lực gửi form, việc kiểm tra phải được thực hiện và phải vượt qua trước khi bất kỳ lời gọi API nào để lưu dữ liệu được khởi tạo

**Kiểm tra: Yêu cầu 4.6.2**

### Thuộc tính 10: Trạng thái loading trong khi lưu

*Với bất kỳ* thao tác lưu đang diễn ra, UI phải hiển thị chỉ báo loading và nút lưu phải bị vô hiệu hóa cho đến khi thao tác hoàn thành

**Kiểm tra: Yêu cầu 4.6.3**

### Thuộc tính 11: Phản hồi kết quả lưu

*Với bất kỳ* thao tác lưu (thành công hoặc thất bại), sau khi hoàn thành, một thông báo phải được hiển thị cho người dùng cho biết kết quả

**Kiểm tra: Yêu cầu 4.5.8**

### Thuộc tính 12: Reset form sau khi thành công

*Với bất kỳ* thao tác lưu thành công, tất cả các trường form phải được reset về giá trị mặc định (ngày hôm nay, tên trống, không chọn bữa ăn, giá mặc định, không phải ngày lễ)

**Kiểm tra: Yêu cầu 4.6.5**

### Thuộc tính 13: Chuyển đổi định dạng ngày

*Với bất kỳ* ngày ở định dạng YYYY-MM-DD (HTML date input), khi được chuyển đổi cho Google Sheets, nó phải được chuyển thành định dạng DD/MM/YYYY

**Kiểm tra: Yêu cầu 4.5.5**

## Xử lý lỗi

### Lỗi phía Client

**Lỗi kiểm tra Form**:
- **Trường bắt buộc trống**: Hiển thị thông báo lỗi inline bằng tiếng Việt ("Vui lòng nhập tên nhân viên", "Vui lòng chọn ngày")
- **Giá không hợp lệ**: Hiển thị thông báo lỗi ("Giá phải là số dương")
- **Chiến lược**: Ngăn gửi form, làm nổi bật các trường không hợp lệ, hiển thị thông báo lỗi rõ ràng

**Lỗi mạng**:
- **Không có kết nối internet**: Hiển thị thông báo "Không có kết nối mạng. Vui lòng kiểm tra và thử lại."
- **Timeout**: Hiển thị thông báo "Yêu cầu quá lâu. Vui lòng thử lại."
- **Chiến lược**: Hiển thị thông báo thân thiện với người dùng, giữ nguyên dữ liệu form, cho phép thử lại

### Lỗi phía Server

**Lỗi Google Sheets API**:
- **Lỗi xác thực**: Ghi log lỗi chi tiết, trả về thông báo chung cho client "Lỗi xác thực. Vui lòng liên hệ quản trị viên."
- **Vượt quá giới hạn tốc độ**: Triển khai exponential backoff, trả về thông báo "Hệ thống đang bận. Vui lòng thử lại sau ít phút."
- **ID spreadsheet/sheet không hợp lệ**: Ghi log lỗi, trả về thông báo "Lỗi cấu hình. Vui lòng liên hệ quản trị viên."
- **Timeout mạng**: Thử lại tối đa 3 lần với exponential backoff, sau đó trả về lỗi

**Lỗi kiểm tra dữ liệu**:
- **Định dạng dữ liệu không hợp lệ**: Kiểm tra trên server, trả về thông báo lỗi cụ thể
- **Thiếu trường bắt buộc**: Trả về lỗi "Thiếu thông tin bắt buộc"
- **Chiến lược**: Luôn kiểm tra trên server ngay cả khi client đã kiểm tra (phòng thủ nhiều lớp)

### Định dạng phản hồi lỗi

```typescript
interface ErrorResponse {
  success: false;
  message: string;        // Thông báo tiếng Việt thân thiện với người dùng
  error?: string;         // Lỗi kỹ thuật (để ghi log, không hiển thị cho người dùng)
  code?: string;          // Mã lỗi để debug
}
```

### Chiến lược ghi log

- **Lỗi Client**: Ghi log vào browser console (chỉ development)
- **Lỗi Server**: Ghi log vào Vercel logs với ngữ cảnh (timestamp, input người dùng, chi tiết lỗi)
- **Dữ liệu nhạy cảm**: Không bao giờ ghi log credentials hoặc phản hồi API đầy đủ
- **Production**: Sử dụng structured logging để debug dễ dàng hơn

## Chiến lược kiểm thử

### Phương pháp kiểm thử kép

Ứng dụng này yêu cầu cả unit tests và property-based tests để có độ bao phủ toàn diện:

- **Unit tests**: Kiểm tra các ví dụ cụ thể, trường hợp biên và điều kiện lỗi
- **Property tests**: Kiểm tra các thuộc tính phổ quát trên tất cả các input

Cả hai phương pháp đều bổ sung và cần thiết. Unit tests bắt các lỗi cụ thể trong các tình huống cụ thể, trong khi property tests kiểm tra tính đúng đắn chung trên một phạm vi rộng các input.

### Kiểm thử dựa trên thuộc tính (Property-Based Testing)

**Thư viện**: Sử dụng `fast-check` cho JavaScript/TypeScript property-based testing

**Cấu hình**:
- Tối thiểu 100 lần lặp cho mỗi property test (do tính ngẫu nhiên)
- Mỗi test phải tham chiếu đến thuộc tính trong tài liệu thiết kế bằng comment tag
- Định dạng tag: `// Feature: cham-com-cong-ty, Property {number}: {property_text}`

**Phạm vi kiểm thử thuộc tính**:

Mỗi thuộc tính đúng đắn được liệt kê ở trên phải được triển khai dưới dạng property-based test:

1. **Thuộc tính 1 (Tính toán tổng)**: Tạo ngẫu nhiên lựa chọn bữa ăn, giá (1000-100000), và hệ số (1 hoặc 2), kiểm tra phép tính
2. **Thuộc tính 2 (Trường bắt buộc)**: Tạo ngẫu nhiên dữ liệu form thiếu ngày hoặc tên, kiểm tra từ chối
3. **Thuộc tính 3 (Giá dương)**: Tạo ngẫu nhiên giá bao gồm âm và 0, kiểm tra chỉ chấp nhận dương
4. **Thuộc tính 4 (Chuyển đổi Checkbox)**: Tạo ngẫu nhiên giá trị boolean, kiểm tra chuyển đổi sang 0/1
5. **Thuộc tính 5 (Định dạng tiền tệ)**: Tạo ngẫu nhiên số dương, kiểm tra định dạng với dấu chấm và đ
6. **Thuộc tính 6 (Tuần tự hóa dữ liệu)**: Tạo ngẫu nhiên bản ghi chấm cơm, kiểm tra cấu trúc và kiểu trường
7. **Thuộc tính 7 (ID tự động tăng)**: Tạo chuỗi bản ghi, kiểm tra mỗi ID là ID trước + 1
8. **Thuộc tính 8 (Cập nhật thời gian thực)**: Tạo ngẫu nhiên thay đổi input, kiểm tra tổng cập nhật
9. **Thuộc tính 9 (Kiểm tra trước khi gửi)**: Tạo dữ liệu form không hợp lệ, kiểm tra không có API call
10. **Thuộc tính 10 (Trạng thái Loading)**: Kiểm tra chỉ báo loading hiển thị trong bất kỳ thao tác lưu nào
11. **Thuộc tính 11 (Phản hồi lưu)**: Kiểm tra thông báo hiển thị sau bất kỳ thao tác lưu nào
12. **Thuộc tính 12 (Reset Form)**: Tạo ngẫu nhiên lưu thành công, kiểm tra form trở về mặc định
13. **Thuộc tính 13 (Định dạng ngày)**: Tạo ngẫu nhiên ngày YYYY-MM-DD, kiểm tra chuyển đổi sang DD/MM/YYYY

### Kiểm thử đơn vị (Unit Testing)

**Các lĩnh vực tập trung**:
- **Các tình huống ví dụ**: Kiểm tra ba ví dụ từ yêu cầu (ngày thường, giá tùy chỉnh, ngày lễ)
- **Trường hợp biên**: Chuỗi rỗng, tên chỉ có khoảng trắng, ngày biên, giá tối đa
- **Điều kiện lỗi**: Lỗi mạng, lỗi API, phản hồi không hợp lệ
- **Điểm tích hợp**: Khởi tạo Google Sheets service, luồng xác thực

**Tổ chức Test**:
```
tests/
├── unit/
│   ├── components/
│   │   ├── MealForm.test.tsx
│   │   ├── PriceInput.test.tsx
│   │   └── TotalDisplay.test.tsx
│   ├── services/
│   │   └── GoogleSheetsService.test.ts
│   └── utils/
│       ├── calculations.test.ts
│       └── formatting.test.ts
└── property/
    ├── calculation.property.test.ts
    ├── validation.property.test.ts
    ├── formatting.property.test.ts
    └── serialization.property.test.ts
```

### Kiểm thử tích hợp (Integration Testing)

**Tích hợp Google Sheets**:
- Sử dụng spreadsheet test (tách biệt với production)
- Kiểm tra các API call thực tế trong CI/CD pipeline
- Xác minh dữ liệu xuất hiện đúng trong sheet
- Kiểm tra luồng xác thực với test service account

**Các tình huống End-to-End**:
- Luồng hoàn chỉnh: Điền form → Gửi → Xác minh trong Google Sheets
- Khôi phục lỗi: Gửi với lỗi mạng → Thử lại → Thành công
- Nhiều lần gửi: Xác minh ID tăng đúng

### Các thực hành tốt nhất về kiểm thử

- **Tránh unit tests quá mức**: Property tests xử lý phạm vi input, tập trung unit tests vào các ví dụ cụ thể
- **Mock Google Sheets API**: Sử dụng mocks cho unit tests nhanh, API thật cho integration tests
- **Kiểm thử bằng tiếng Việt**: Thông báo lỗi và văn bản UI nên được kiểm thử bằng tiếng Việt
- **Kiểm thử responsive**: Kiểm tra trên mobile và desktop viewports
- **Khả năng tiếp cận**: Kiểm tra điều hướng bàn phím và khả năng tương thích với screen reader

