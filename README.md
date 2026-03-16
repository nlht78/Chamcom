# Ứng dụng Chấm Cơm Công Ty

Ứng dụng web đơn giản cho phép nhân viên chấm cơm hàng ngày với tính năng tự động tính toán chi phí và đồng bộ dữ liệu lên Google Sheets.

## Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API Integration**: Google Sheets API (googleapis)
- **Testing**: Jest, React Testing Library, fast-check (Property-based testing)
- **Deployment**: Vercel

## Cấu trúc thư mục

```
.
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
├── services/              # Business logic và API services
├── lib/                   # Utility functions
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   └── property/         # Property-based tests
├── .env.local            # Local environment variables (không commit)
└── .env.example          # Template cho environment variables
```

## Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd cham-com-cong-ty
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Google Sheets API

#### Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới:
   - Click vào dropdown project ở góc trên bên trái
   - Click "New Project"
   - Đặt tên project (ví dụ: "Cham Com Cong Ty")
   - Click "Create"
3. Enable Google Sheets API:
   - Vào menu bên trái > "APIs & Services" > "Library"
   - Tìm kiếm "Google Sheets API"
   - Click vào "Google Sheets API"
   - Click "Enable"

#### Bước 2: Tạo Service Account

1. Vào "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Điền thông tin service account:
   - Service account name: Đặt tên (ví dụ: "sheets-service")
   - Service account ID: Tự động tạo
   - Description: Mô tả (optional)
4. Click "Create and Continue"
5. Bỏ qua phần "Grant this service account access to project" (optional)
6. Click "Continue" và "Done"

#### Bước 3: Tạo và tải Private Key

1. Trong danh sách Service Accounts, click vào service account vừa tạo
2. Vào tab "Keys"
3. Click "Add Key" > "Create new key"
4. Chọn key type: "JSON"
5. Click "Create"
6. File JSON sẽ được tải về máy tự động
7. **Lưu file này an toàn** - đây là credentials để truy cập Google Sheets

#### Bước 4: Chia sẻ Google Sheet với Service Account

1. Mở file JSON vừa tải xuống
2. Tìm và copy giá trị của trường `client_email` (có dạng: xxx@xxx.iam.gserviceaccount.com)
3. Mở Google Sheet mà bạn muốn sử dụng:
   - URL: https://docs.google.com/spreadsheets/d/1bn9mGEME4gb5wUNZ0riAgvbwn65gvJvKNJyz8BFxOxw/edit
   - Hoặc tạo sheet mới nếu muốn
4. Click nút "Share" (Chia sẻ) ở góc trên bên phải
5. Paste email của service account vào trường "Add people and groups"
6. Chọn quyền: "Editor" (Người chỉnh sửa)
7. **Bỏ tick** "Notify people" (không cần gửi email thông báo)
8. Click "Share"

#### Bước 5: Lấy Spreadsheet ID và Sheet ID

1. **Spreadsheet ID**: Lấy từ URL của Google Sheet
   - URL format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid={SHEET_ID}`
   - Ví dụ: `1bn9mGEME4gb5wUNZ0riAgvbwn65gvJvKNJyz8BFxOxw`

2. **Sheet ID (gid)**: Lấy từ URL sau dấu `#gid=`
   - Ví dụ: `1685564899`
   - Nếu không có gid trong URL, mặc định là `0`

#### Bước 6: Cấu hình biến môi trường

1. Copy file `.env.example` thành `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Mở file JSON credentials đã tải về

3. Mở file `.env.local` và điền thông tin từ file JSON:
   ```env
   # Copy từ trường "client_email" trong file JSON
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   
   # Copy từ trường "private_key" trong file JSON
   # LƯU Ý: Giữ nguyên các ký tự \n, không thay thế bằng line breaks thật
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
   
   # Lấy từ URL Google Sheet
   GOOGLE_SPREADSHEET_ID=1bn9mGEME4gb5wUNZ0riAgvbwn65gvJvKNJyz8BFxOxw
   
   # Lấy từ URL Google Sheet (sau #gid=)
   GOOGLE_SHEET_ID=1685564899
   ```

   **Lưu ý quan trọng về GOOGLE_PRIVATE_KEY**:
   - Copy toàn bộ giá trị của trường `private_key` từ file JSON
   - Bao gồm cả `-----BEGIN PRIVATE KEY-----` và `-----END PRIVATE KEY-----`
   - Giữ nguyên các ký tự `\n` (đây là ký tự xuống dòng, không phải line break thật)
   - Đặt toàn bộ trong dấu ngoặc kép
   - Ví dụ: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"`

4. Lưu file `.env.local`

5. **Bảo mật**: Đảm bảo file `.env.local` đã có trong `.gitignore` (không commit lên Git)

### 4. Chạy ứng dụng

#### Development mode:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

#### Production build:

```bash
npm run build
npm start
```

## Testing

### Chạy tất cả tests:

```bash
npm test
```

### Chạy tests ở watch mode:

```bash
npm run test:watch
```

### Các loại tests:

- **Unit Tests**: Kiểm tra các component và functions riêng lẻ
- **Property-based Tests**: Kiểm tra các thuộc tính phổ quát với fast-check
- **Integration Tests**: Kiểm tra tích hợp với Google Sheets API

## Deployment lên Vercel

### Phương pháp 1: Deploy qua Vercel Dashboard (Khuyến nghị)

1. **Kết nối repository với Vercel**:
   - Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import Git repository của bạn (GitHub, GitLab, hoặc Bitbucket)
   - Vercel sẽ tự động phát hiện Next.js project

2. **Cấu hình Environment Variables**:
   - Trong quá trình import, click "Environment Variables"
   - Thêm các biến sau (copy từ file `.env.local`):
     - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Email của service account
     - `GOOGLE_PRIVATE_KEY`: Private key (giữ nguyên format với `\n`)
     - `GOOGLE_SPREADSHEET_ID`: ID của spreadsheet
     - `GOOGLE_SHEET_ID`: ID của sheet (gid)
   
   **Lưu ý quan trọng về GOOGLE_PRIVATE_KEY**:
   - Paste toàn bộ giá trị bao gồm `-----BEGIN PRIVATE KEY-----` và `-----END PRIVATE KEY-----`
   - Giữ nguyên các ký tự `\n` (không thay thế bằng line breaks thật)
   - Đặt trong dấu ngoặc kép nếu Vercel yêu cầu

3. **Deploy**:
   - Click "Deploy"
   - Vercel sẽ build và deploy ứng dụng
   - Sau khi hoàn thành, bạn sẽ nhận được URL production

4. **Kiểm tra deployment**:
   - Mở URL production
   - Test chức năng chấm cơm
   - Kiểm tra dữ liệu có được lưu vào Google Sheets không

### Phương pháp 2: Deploy qua Vercel CLI

1. **Cài đặt Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login vào Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy lần đầu**:
   ```bash
   vercel
   ```
   - Trả lời các câu hỏi setup
   - Vercel sẽ tạo project mới

4. **Thêm Environment Variables**:
   ```bash
   vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
   vercel env add GOOGLE_PRIVATE_KEY
   vercel env add GOOGLE_SPREADSHEET_ID
   vercel env add GOOGLE_SHEET_ID
   ```
   - Chọn environment: Production, Preview, Development
   - Paste giá trị cho mỗi biến

5. **Deploy lên production**:
   ```bash
   vercel --prod
   ```

### Cập nhật Environment Variables sau khi deploy

Nếu cần thay đổi environment variables:

1. Vào Vercel Dashboard > Project > Settings > Environment Variables
2. Edit hoặc thêm biến mới
3. **Quan trọng**: Redeploy project để áp dụng thay đổi:
   - Vào tab "Deployments"
   - Click vào deployment mới nhất
   - Click "Redeploy"

### Xử lý lỗi thường gặp khi deploy

**Lỗi: "Invalid credentials"**
- Kiểm tra `GOOGLE_SERVICE_ACCOUNT_EMAIL` có đúng không
- Kiểm tra `GOOGLE_PRIVATE_KEY` có giữ nguyên format với `\n` không
- Đảm bảo service account đã được share quyền Editor trên Google Sheet

**Lỗi: "Cannot find spreadsheet"**
- Kiểm tra `GOOGLE_SPREADSHEET_ID` có đúng không
- Kiểm tra service account đã được share quyền trên sheet chưa

**Lỗi: Build failed**
- Kiểm tra code có lỗi syntax không
- Chạy `npm run build` locally để test
- Xem build logs trên Vercel để biết chi tiết lỗi

## Hướng dẫn sử dụng

### Quy trình chấm cơm

1. **Mở ứng dụng**: Truy cập URL của ứng dụng (localhost:3000 hoặc URL production)

2. **Nhập thông tin nhân viên**:
   - Nhập tên nhân viên vào trường "Tên Nhân Viên"
   - Tên là bắt buộc, không được để trống

3. **Chọn ngày**:
   - Ngày mặc định là hôm nay
   - Có thể chọn ngày khác bằng date picker
   - Định dạng hiển thị: DD/MM/YYYY

4. **Chọn bữa ăn**:
   - Tick checkbox "Sáng" nếu ăn sáng (giá mặc định: 12.000đ)
   - Tick checkbox "Trưa" nếu ăn trưa (giá mặc định: 30.000đ)
   - Tick checkbox "Chiều" nếu ăn chiều (giá mặc định: 30.000đ)
   - Có thể chọn một, nhiều hoặc tất cả các bữa

5. **Điều chỉnh giá (nếu cần)**:
   - Mỗi bữa ăn có trường nhập giá riêng
   - Có thể thay đổi giá trước khi lưu
   - Giá phải là số dương

6. **Đánh dấu ngày lễ (nếu có)**:
   - Tick checkbox "Ngày lễ" nếu là ngày lễ
   - Hệ số sẽ tự động nhân đôi (x2)
   - Tổng cộng sẽ được tính lại tự động

7. **Xem tổng chi phí**:
   - Tổng cộng được tính tự động khi bạn thay đổi bất kỳ thông tin nào
   - Công thức: (Giá Sáng × Sáng + Giá Trưa × Trưa + Giá Chiều × Chiều) × Hệ số
   - Hiển thị với định dạng tiền Việt Nam (ví dụ: 72.000đ)

8. **Lưu dữ liệu**:
   - Nhấn nút "Lưu"
   - Hệ thống sẽ kiểm tra dữ liệu
   - Nếu hợp lệ, dữ liệu sẽ được lưu vào Google Sheets
   - Hiển thị thông báo thành công hoặc lỗi

9. **Sau khi lưu thành công**:
   - Form sẽ tự động reset về giá trị mặc định
   - Có thể tiếp tục nhập dữ liệu cho nhân viên khác

### Ví dụ sử dụng

**Ví dụ 1: Ngày thường, ăn đủ 3 bữa**
- Tên: Nguyễn Văn A
- Ngày: 13/03/2026
- Sáng: ✓ (12.000đ)
- Trưa: ✓ (30.000đ)
- Chiều: ✓ (30.000đ)
- Ngày lễ: ✗
- **Tổng: 72.000đ**

**Ví dụ 2: Ngày thường, giá tùy chỉnh**
- Tên: Trần Thị B
- Ngày: 13/03/2026
- Sáng: ✗
- Trưa: ✓ (30.000đ)
- Chiều: ✓ (28.000đ - đã chỉnh sửa)
- Ngày lễ: ✗
- **Tổng: 58.000đ**

**Ví dụ 3: Ngày lễ**
- Tên: Lê Văn C
- Ngày: 30/04/2026
- Sáng: ✓ (12.000đ)
- Trưa: ✓ (30.000đ)
- Chiều: ✗
- Ngày lễ: ✓ (Hệ số x2)
- **Tổng: 84.000đ** (42.000 × 2)

### Xử lý lỗi

**Lỗi: "Vui lòng nhập tên nhân viên"**
- Nguyên nhân: Trường tên nhân viên bị bỏ trống
- Giải pháp: Nhập tên nhân viên

**Lỗi: "Vui lòng chọn ngày"**
- Nguyên nhân: Trường ngày bị bỏ trống
- Giải pháp: Chọn ngày từ date picker

**Lỗi: "Giá phải là số dương"**
- Nguyên nhân: Giá bữa ăn nhập vào là số âm hoặc 0
- Giải pháp: Nhập giá là số dương (> 0)

**Lỗi: "Không có kết nối mạng"**
- Nguyên nhân: Mất kết nối internet
- Giải pháp: Kiểm tra kết nối mạng và thử lại

**Lỗi: "Lỗi xác thực"**
- Nguyên nhân: Cấu hình Google Service Account không đúng
- Giải pháp: Kiểm tra lại environment variables và quyền truy cập Google Sheet

## Cấu trúc Google Sheets

Dữ liệu được lưu với các cột sau:

| ID | Ngày | Tên Nhân Viên | Sáng | Trưa | Chiều | Hệ số | Tổng cộng |
|----|------|---------------|------|------|-------|-------|-----------|
| 1  | 13/03/2026 | Nguyễn Văn A | 1 | 1 | 1 | 1 | 72000 |
| 2  | 13/03/2026 | Trần Thị B | 0 | 1 | 1 | 1 | 58000 |
| 3  | 30/04/2026 | Lê Văn C | 1 | 1 | 0 | 2 | 84000 |

**Giải thích các cột**:
- **ID**: Số thứ tự tự động tăng (1, 2, 3, ...)
- **Ngày**: Định dạng DD/MM/YYYY
- **Tên Nhân Viên**: Tên người chấm cơm
- **Sáng/Trưa/Chiều**: 1 = có ăn, 0 = không ăn
- **Hệ số**: 1 = ngày thường, 2 = ngày lễ
- **Tổng cộng**: Tổng chi phí (số không định dạng)

## Xử lý sự cố (Troubleshooting)

### Lỗi khi chạy ứng dụng

**Lỗi: "Cannot find module 'googleapis'"**
```bash
# Giải pháp: Cài đặt lại dependencies
npm install
```

**Lỗi: "Environment variable not found"**
```bash
# Giải pháp: Kiểm tra file .env.local đã tồn tại và có đầy đủ biến
# Copy từ .env.example nếu chưa có
cp .env.example .env.local
```

**Lỗi: "Port 3000 already in use"**
```bash
# Giải pháp: Chạy trên port khác
PORT=3001 npm run dev
```

### Lỗi khi kết nối Google Sheets

**Lỗi: "Invalid credentials" hoặc "Authentication failed"**

Nguyên nhân và giải pháp:
1. **Service account email sai**:
   - Kiểm tra `GOOGLE_SERVICE_ACCOUNT_EMAIL` trong `.env.local`
   - So sánh với trường `client_email` trong file JSON credentials

2. **Private key không đúng format**:
   - Đảm bảo copy toàn bộ private key từ file JSON
   - Giữ nguyên các ký tự `\n` (không thay thế bằng line breaks thật)
   - Đặt trong dấu ngoặc kép
   - Ví dụ đúng: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`

3. **Private key bị thay đổi**:
   - Tạo lại key mới từ Google Cloud Console
   - Cập nhật lại trong `.env.local`

**Lỗi: "The caller does not have permission"**

Nguyên nhân: Service account chưa được share quyền truy cập Google Sheet

Giải pháp:
1. Mở Google Sheet
2. Click "Share"
3. Thêm email của service account (từ `GOOGLE_SERVICE_ACCOUNT_EMAIL`)
4. Cấp quyền "Editor"
5. Click "Share"

**Lỗi: "Requested entity was not found" hoặc "Spreadsheet not found"**

Nguyên nhân: Spreadsheet ID hoặc Sheet ID không đúng

Giải pháp:
1. Kiểm tra URL của Google Sheet:
   - Format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit#gid={SHEET_ID}`
2. Copy đúng `SPREADSHEET_ID` vào `GOOGLE_SPREADSHEET_ID`
3. Copy đúng `SHEET_ID` (gid) vào `GOOGLE_SHEET_ID`
4. Nếu không có gid trong URL, sử dụng `0`

**Lỗi: "Rate limit exceeded"**

Nguyên nhân: Gọi API quá nhiều lần trong thời gian ngắn

Giải pháp:
- Đợi vài phút rồi thử lại
- Google Sheets API có giới hạn: 100 requests/100 seconds/user

### Lỗi khi deploy lên Vercel

**Lỗi: "Build failed"**

Giải pháp:
1. Chạy build locally để kiểm tra:
   ```bash
   npm run build
   ```
2. Sửa các lỗi syntax hoặc type errors
3. Commit và push lại code

**Lỗi: "Environment variables not working on Vercel"**

Giải pháp:
1. Vào Vercel Dashboard > Project > Settings > Environment Variables
2. Kiểm tra tất cả biến đã được thêm đúng
3. Đảm bảo chọn đúng environment (Production/Preview/Development)
4. Sau khi thêm/sửa biến, phải **Redeploy** project:
   - Vào tab "Deployments"
   - Click vào deployment mới nhất
   - Click "Redeploy"

**Lỗi: "Function execution timeout"**

Nguyên nhân: Kết nối Google Sheets API quá lâu

Giải pháp:
- Kiểm tra kết nối mạng của Vercel
- Kiểm tra Google Sheets API có hoạt động không
- Thử deploy lại

### Lỗi khi chạy tests

**Lỗi: "Test suite failed to run"**

Giải pháp:
```bash
# Xóa cache và chạy lại
npm run test -- --clearCache
npm test
```

**Lỗi: "Cannot find module in test"**

Giải pháp:
```bash
# Cài đặt lại dependencies
rm -rf node_modules package-lock.json
npm install
```

### Câu hỏi thường gặp (FAQ)

**Q: Có thể sử dụng nhiều Google Sheets khác nhau không?**

A: Có, chỉ cần thay đổi `GOOGLE_SPREADSHEET_ID` và `GOOGLE_SHEET_ID` trong environment variables.

**Q: Có thể thêm nhiều service accounts không?**

A: Có, bạn có thể share Google Sheet với nhiều service accounts khác nhau.

**Q: Dữ liệu có bị ghi đè không?**

A: Không, dữ liệu luôn được append (thêm vào cuối), không ghi đè dữ liệu cũ.

**Q: Có thể xóa hoặc sửa dữ liệu đã lưu không?**

A: Ứng dụng hiện tại chỉ hỗ trợ thêm dữ liệu mới. Để xóa/sửa, bạn cần vào Google Sheets trực tiếp.

**Q: Có giới hạn số lượng bản ghi không?**

A: Google Sheets có giới hạn 10 triệu cells/spreadsheet. Với 8 cột, bạn có thể lưu khoảng 1.25 triệu bản ghi.

**Q: Làm sao để backup dữ liệu?**

A: Dữ liệu đã được lưu trên Google Sheets, bạn có thể:
- Download sheet dưới dạng Excel/CSV
- Tạo copy của sheet: File > Make a copy
- Sử dụng Google Sheets version history

## Đóng góp (Contributing)

Nếu bạn muốn đóng góp cho dự án:

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit changes: `git commit -m 'Thêm tính năng mới'`
4. Push to branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

## Liên hệ

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.

## Giấy phép

MIT
