# Kế hoạch triển khai: Ứng dụng Chấm Cơm Công Ty

## Tổng quan

Kế hoạch triển khai này chia nhỏ ứng dụng chấm cơm thành các tác vụ lập trình rời rạc. Ứng dụng được xây dựng với Next.js (App Router), Tailwind CSS và tích hợp Google Sheets API. Mỗi tác vụ được xây dựng tăng dần, với property-based tests và unit tests được tích hợp xuyên suốt để phát hiện lỗi sớm.

## Các tác vụ

- [x] 1. Thiết lập cấu trúc dự án Next.js và các dependencies
  - Khởi tạo dự án Next.js với App Router và TypeScript
  - Cài đặt dependencies: googleapis, fast-check (cho property testing), tailwindcss
  - Cấu hình Tailwind CSS
  - Thiết lập cấu trúc biến môi trường (.env.local, .env.example)
  - Tạo cấu trúc thư mục cơ bản: app/, components/, services/, lib/, tests/
  - _Yêu cầu: 5.1_

- [ ] 2. Triển khai các hàm tiện ích cho tính toán và định dạng
  - [x] 2.1 Tạo các tiện ích tính toán
    - Triển khai hàm `calculateTotal(breakfast, lunch, dinner, breakfastPrice, lunchPrice, dinnerPrice, multiplier)`
    - Triển khai `booleanToBinary(value)` để chuyển đổi trạng thái checkbox sang 0/1
    - _Yêu cầu: 4.4.1, 4.5.6_
  
  - [ ]* 2.2 Viết property test cho tính toán tổng
    - **Thuộc tính 1: Tính toán tổng chi phí**
    - **Kiểm tra: Yêu cầu 4.4.1**
    - Tạo ngẫu nhiên lựa chọn bữa ăn, giá (1000-100000), hệ số (1 hoặc 2)
    - Kiểm tra: tổng = (sáng × giá_sáng + trưa × giá_trưa + chiều × giá_chiều) × hệ_số
  
  - [ ]* 2.3 Viết property test cho chuyển đổi checkbox
    - **Thuộc tính 4: Chuyển đổi Checkbox sang nhị phân**
    - **Kiểm tra: Yêu cầu 4.1.2, 4.5.6**
    - Tạo ngẫu nhiên giá trị boolean
    - Kiểm tra: true chuyển thành 1, false chuyển thành 0
  
  - [x] 2.4 Tạo các tiện ích định dạng
    - Triển khai `formatCurrency(amount)` để định dạng số với dấu phân cách hàng nghìn và hậu tố đ
    - Triển khai `formatDateToDDMMYYYY(dateString)` để chuyển YYYY-MM-DD sang DD/MM/YYYY
    - Triển khai `formatDateToYYYYMMDD(dateString)` cho HTML date input
    - _Yêu cầu: 4.4.3, 4.5.5_
  
  - [ ]* 2.5 Viết property test cho định dạng tiền tệ
    - **Thuộc tính 5: Định dạng tiền tệ**
    - **Kiểm tra: Yêu cầu 4.4.3**
    - Tạo ngẫu nhiên số dương (1-10000000)
    - Kiểm tra: output chứa dấu chấm làm dấu phân cách hàng nghìn và hậu tố đ
  
  - [ ]* 2.6 Viết property test cho chuyển đổi định dạng ngày
    - **Thuộc tính 13: Chuyển đổi định dạng ngày**
    - **Kiểm tra: Yêu cầu 4.5.5**
    - Tạo ngẫu nhiên ngày ở định dạng YYYY-MM-DD
    - Kiểm tra: chuyển đổi sang DD/MM/YYYY đúng
  
  - [ ]* 2.7 Viết unit tests cho các hàm tiện ích
    - Kiểm tra ba ví dụ từ yêu cầu (72.000đ, 58.000đ, 84.000đ)
    - Kiểm tra trường hợp biên: giá bằng 0, giá tối đa, ngày biên
    - _Yêu cầu: 4.4.1, 4.4.3, 4.5.5_

- [x] 3. Triển khai logic kiểm tra form
  - [x] 3.1 Tạo các hàm kiểm tra
    - Triển khai `validateEmployeeName(name)` - bắt buộc, không rỗng sau khi trim
    - Triển khai `validateDate(date)` - bắt buộc, định dạng ngày hợp lệ
    - Triển khai `validatePrice(price)` - chỉ số dương
    - Triển khai `validateForm(formData)` - kiểm tra tất cả các trường
    - _Yêu cầu: 4.1.5, 4.2.4_
  
  - [ ]* 3.2 Viết property test cho kiểm tra trường bắt buộc
    - **Thuộc tính 2: Kiểm tra trường bắt buộc**
    - **Kiểm tra: Yêu cầu 4.1.5**
    - Tạo ngẫu nhiên dữ liệu form thiếu ngày hoặc tên nhân viên trống
    - Kiểm tra: kiểm tra thất bại với lỗi phù hợp
  
  - [ ]* 3.3 Viết property test cho kiểm tra giá dương
    - **Thuộc tính 3: Kiểm tra giá dương**
    - **Kiểm tra: Yêu cầu 4.2.4**
    - Tạo ngẫu nhiên giá bao gồm âm, 0 và dương
    - Kiểm tra: chỉ giá trị dương vượt qua kiểm tra
  
  - [ ]* 3.4 Viết unit tests cho các trường hợp biên kiểm tra
    - Kiểm tra tên nhân viên chỉ có khoảng trắng
    - Kiểm tra định dạng ngày không hợp lệ
    - Kiểm tra giá trị biên cho giá
    - _Yêu cầu: 4.1.5, 4.2.4_

- [ ] 4. Triển khai dịch vụ Google Sheets
  - [x] 4.1 Tạo class GoogleSheetsService
    - Khởi tạo Google Sheets API client với xác thực service account
    - Triển khai phương thức private `getNextId()` để lấy ID tự động tăng
    - Triển khai phương thức `appendMealRecord(record)` để thêm dòng vào sheet
    - Thêm xử lý lỗi với logic thử lại (exponential backoff, tối đa 3 lần)
    - _Yêu cầu: 4.5.1, 4.5.2, 4.5.4_
  
  - [x] 4.2 Tạo các hàm chuyển đổi dữ liệu
    - Triển khai `formDataToSheetRow(formData, id)` để chuyển dữ liệu form sang định dạng dòng sheet
    - Đảm bảo thứ tự cột đúng: ID, Ngày, Tên, Sáng, Trưa, Chiều, Hệ số, Tổng cộng
    - _Yêu cầu: 4.5.3, 4.5.6, 4.5.7_
  
  - [ ]* 4.3 Viết property test cho tuần tự hóa dữ liệu
    - **Thuộc tính 6: Tuần tự hóa dữ liệu cho Google Sheets**
    - **Kiểm tra: Yêu cầu 4.5.3, 4.5.5, 4.5.7**
    - Tạo ngẫu nhiên bản ghi chấm cơm
    - Kiểm tra: dữ liệu tuần tự hóa có chính xác 8 trường theo đúng thứ tự với kiểu đúng
  
  - [ ]* 4.4 Viết unit tests cho dịch vụ Google Sheets
    - Mock Google Sheets API
    - Kiểm tra thao tác append thành công
    - Kiểm tra lỗi xác thực
    - Kiểm tra lỗi mạng và logic thử lại
    - Kiểm tra ID tự động tăng
    - _Yêu cầu: 4.5.1, 4.5.4_

- [x] 5. Checkpoint - Đảm bảo các tiện ích và dịch vụ cốt lõi hoạt động
  - Chạy tất cả tests (property tests và unit tests)
  - Kiểm tra dịch vụ Google Sheets có thể kết nối (sử dụng test spreadsheet)
  - Đảm bảo tất cả tests đều pass, hỏi người dùng nếu có câu hỏi phát sinh.

- [x] 6. Tạo Server Action để lưu bản ghi chấm cơm
  - [x] 6.1 Triển khai saveMealRecord Server Action
    - Tạo server action trong app/actions.ts
    - Kiểm tra dữ liệu input phía server
    - Tính tổng trên server để xác minh phép tính client
    - Gọi GoogleSheetsService để thêm bản ghi
    - Trả về phản hồi thành công/lỗi với thông báo tiếng Việt phù hợp
    - _Yêu cầu: 4.5.8, 4.6.3, 4.6.4_
  
  - [ ]* 6.2 Viết property test cho kiểm tra trước khi gửi
    - **Thuộc tính 9: Kiểm tra Form trước khi gửi**
    - **Kiểm tra: Yêu cầu 4.6.2**
    - Tạo dữ liệu form không hợp lệ
    - Kiểm tra: kiểm tra thất bại trước khi có bất kỳ API call nào
  
  - [ ]* 6.3 Viết unit tests cho Server Action
    - Kiểm tra lưu thành công với dữ liệu hợp lệ
    - Kiểm tra lỗi kiểm tra
    - Kiểm tra lỗi Google Sheets API
    - Kiểm tra bản địa hóa thông báo lỗi (tiếng Việt)
    - _Yêu cầu: 4.5.8, 4.6.4_

- [x] 7. Triển khai component PriceInput
  - [x] 7.1 Tạo component PriceInput
    - Tạo component có thể tái sử dụng cho các input giá
    - Triển khai định dạng tiền tệ Việt Nam khi hiển thị
    - Xử lý input số với kiểm tra (chỉ dương)
    - Thêm label và styling với Tailwind
    - _Yêu cầu: 4.2.1, 4.2.4_
  
  - [ ]* 7.2 Viết unit tests cho component PriceInput
    - Kiểm tra render với các giá trị khác nhau
    - Kiểm tra onChange handler
    - Kiểm tra kiểm tra giá trị âm/0
    - Kiểm tra hiển thị định dạng tiền tệ
    - _Yêu cầu: 4.2.1, 4.2.4_

- [x] 8. Triển khai component TotalDisplay
  - [x] 8.1 Tạo component TotalDisplay
    - Hiển thị tổng đã tính toán với styling nổi bật
    - Định dạng số với dấu phân cách hàng nghìn và hậu tố đ
    - Làm cho nó nổi bật về mặt hình ảnh (font lớn hơn, đậm, có màu)
    - _Yêu cầu: 4.4.2, 4.4.3_
  
  - [ ]* 8.2 Viết unit tests cho component TotalDisplay
    - Kiểm tra render với các số tiền khác nhau
    - Kiểm tra định dạng tiền tệ
    - Kiểm tra các class styling được áp dụng
    - _Yêu cầu: 4.4.3_

- [x] 9. Triển khai component MealForm chính
  - [x] 9.1 Tạo cấu trúc component MealForm
    - Thiết lập component là Client Component ('use client')
    - Định nghĩa interface MealFormState và khởi tạo state
    - Đặt giá trị mặc định: ngày hôm nay, tên trống, không chọn bữa ăn, giá mặc định (12000, 30000, 30000), không phải ngày lễ
    - _Yêu cầu: 4.1.1, 4.1.3, 4.2.2_
  
  - [x] 9.2 Triển khai các input form
    - Thêm date input (type="date", mặc định là hôm nay)
    - Thêm text input tên nhân viên
    - Thêm checkboxes cho sáng, trưa, chiều
    - Thêm các component PriceInput cho giá mỗi bữa
    - Thêm checkbox ngày lễ
    - Thêm label tiếng Việt cho tất cả inputs
    - _Yêu cầu: 4.1.1, 4.1.2, 4.2.1, 4.3.1_
  
  - [x] 9.3 Triển khai tính toán tổng theo thời gian thực
    - Thêm useEffect hoặc hàm tính toán chạy khi state thay đổi
    - Cập nhật hiển thị tổng bất cứ khi nào input thay đổi
    - Sử dụng hàm tiện ích calculateTotal
    - _Yêu cầu: 4.4.2_
  
  - [ ]* 9.4 Viết property test cho cập nhật tổng theo thời gian thực
    - **Thuộc tính 8: Cập nhật tổng theo thời gian thực**
    - **Kiểm tra: Yêu cầu 4.4.2**
    - Tạo ngẫu nhiên thay đổi input
    - Kiểm tra: tổng cập nhật ngay lập tức sau mỗi thay đổi
  
  - [x] 9.5 Triển khai handler gửi form
    - Thêm hàm handleSubmit
    - Kiểm tra form trước khi gửi
    - Đặt trạng thái loading trong khi gửi
    - Gọi saveMealRecord Server Action
    - Xử lý phản hồi thành công/lỗi
    - Hiển thị thông báo thành công/lỗi tiếng Việt
    - _Yêu cầu: 4.6.1, 4.6.2, 4.6.3, 4.6.4_
  
  - [ ]* 9.6 Viết property test cho trạng thái loading
    - **Thuộc tính 10: Trạng thái Loading trong khi lưu**
    - **Kiểm tra: Yêu cầu 4.6.3**
    - Mô phỏng thao tác lưu
    - Kiểm tra: chỉ báo loading hiển thị và nút bị vô hiệu hóa trong khi thao tác
  
  - [ ]* 9.7 Viết property test cho phản hồi kết quả lưu
    - **Thuộc tính 11: Phản hồi kết quả lưu**
    - **Kiểm tra: Yêu cầu 4.5.8**
    - Tạo ngẫu nhiên kết quả lưu (thành công/thất bại)
    - Kiểm tra: thông báo hiển thị sau mỗi thao tác
  
  - [x] 9.6 Triển khai reset form sau khi lưu thành công
    - Tạo hàm resetForm
    - Reset tất cả trường về giá trị mặc định sau khi lưu thành công
    - Xóa mọi thông báo lỗi
    - _Yêu cầu: 4.6.5_
  
  - [ ]* 9.9 Viết property test cho reset form
    - **Thuộc tính 12: Reset Form sau khi thành công**
    - **Kiểm tra: Yêu cầu 4.6.5**
    - Tạo ngẫu nhiên lưu thành công
    - Kiểm tra: tất cả trường trở về giá trị mặc định
  
  - [ ]* 9.10 Viết unit tests cho component MealForm
    - Kiểm tra render form với tất cả inputs
    - Kiểm tra tương tác người dùng (gõ, chọn boxes)
    - Kiểm tra luồng gửi form
    - Kiểm tra hiển thị lỗi
    - Kiểm tra thông báo thành công và reset form
    - _Yêu cầu: 4.1.1, 4.6.1, 4.6.5_

- [x] 10. Tạo trang chính và layout
  - [x] 10.1 Triển khai app/page.tsx
    - Tạo trang chính render component MealForm
    - Thêm tiêu đề trang "Chấm Cơm Công Ty"
    - Thêm cấu trúc layout cơ bản
    - _Yêu cầu: 4.1.1_
  
  - [x] 10.2 Style ứng dụng
    - Áp dụng Tailwind CSS cho thiết kế responsive
    - Đảm bảo layout thân thiện với mobile
    - Sử dụng font và màu sắc dễ đọc
    - Thêm khoảng cách và căn chỉnh phù hợp
    - Kiểm tra trên mobile và desktop viewports
    - _Yêu cầu: 5.3.1, 5.3.2, 5.3.3, 5.3.4_
  
  - [ ]* 10.3 Viết unit tests cho render trang
    - Kiểm tra trang render không lỗi
    - Kiểm tra layout responsive
    - Kiểm tra hiển thị văn bản tiếng Việt
    - _Yêu cầu: 5.3.2, 5.3.3_

- [ ] 11. Checkpoint - Đảm bảo ứng dụng hoàn chỉnh hoạt động end-to-end
  - Chạy tất cả tests (property tests và unit tests)
  - Kiểm tra luồng hoàn chỉnh thủ công: điền form → gửi → xác minh trong Google Sheets
  - Kiểm tra các tình huống lỗi: input không hợp lệ, lỗi mạng
  - Kiểm tra trên mobile và desktop browsers
  - Đảm bảo tất cả tests đều pass, hỏi người dùng nếu có câu hỏi phát sinh.

- [x] 12. Thiết lập cấu hình môi trường và deployment
  - [x] 12.1 Cấu hình biến môi trường
    - Tạo .env.example với tất cả biến bắt buộc
    - Tài liệu hóa cách lấy Google Service Account credentials
    - Thêm hướng dẫn thiết lập Google Sheets API access
    - _Yêu cầu: 5.4.1_
  
  - [x] 12.2 Chuẩn bị cho Vercel deployment
    - Tạo vercel.json nếu cần
    - Tài liệu hóa thiết lập biến môi trường trong Vercel
    - Thêm hướng dẫn deployment vào README
    - _Yêu cầu: 5.1.4_
  
  - [x] 12.3 Tạo tài liệu README
    - Thêm tổng quan dự án bằng tiếng Việt
    - Thêm hướng dẫn thiết lập
    - Thêm tài liệu biến môi trường
    - Thêm hướng dẫn deployment
    - Thêm hướng dẫn sử dụng
    - _Yêu cầu: 5.5.1_

- [ ]* 13. Viết integration tests
  - [ ] 13.1 Thiết lập môi trường integration test
    - Tạo test Google Spreadsheet
    - Thiết lập test service account
    - Cấu hình biến môi trường test
  
  - [ ] 13.2 Viết end-to-end integration tests
    - Kiểm tra luồng hoàn chỉnh với Google Sheets API thật
    - Kiểm tra nhiều lần gửi với ID tự động tăng
    - Kiểm tra các tình huống khôi phục lỗi
    - Xác minh dữ liệu xuất hiện đúng trong sheet
    - _Yêu cầu: 4.5.1, 4.5.4_
  
  - [ ]* 13.3 Viết property test cho ID tự động tăng
    - **Thuộc tính 7: ID tự động tăng**
    - **Kiểm tra: Yêu cầu 4.5.4**
    - Tạo chuỗi bản ghi chấm cơm
    - Kiểm tra: mỗi ID mới chính xác là ID trước + 1

- [ ] 14. Checkpoint cuối cùng và hoàn thiện
  - Chạy bộ test hoàn chỉnh (unit, property, integration)
  - Kiểm tra cả ba ví dụ từ tài liệu yêu cầu
  - Xác minh tất cả văn bản tiếng Việt đúng
  - Kiểm tra thiết kế responsive trên nhiều thiết bị
  - Xem xét thông báo lỗi về độ rõ ràng
  - Đảm bảo tất cả tests đều pass, hỏi người dùng nếu có câu hỏi phát sinh.

## Ghi chú

- Các tác vụ đánh dấu `*` là tùy chọn và có thể bỏ qua để có MVP nhanh hơn
- Mỗi tác vụ tham chiếu đến yêu cầu cụ thể để có thể truy vết
- Property tests sử dụng thư viện fast-check với tối thiểu 100 lần lặp
- Tất cả property tests phải bao gồm comment tags tham chiếu đến các thuộc tính thiết kế
- Các checkpoints đảm bảo kiểm tra tăng dần trong suốt quá trình phát triển
- Ngôn ngữ tiếng Việt được sử dụng cho tất cả văn bản hướng đến người dùng
- Tích hợp Google Sheets sử dụng xác thực service account để bảo mật
