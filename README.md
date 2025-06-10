# LẬP TRÌNH ỨNG DỤNG WEB - NHÓM 6

## TÊN ĐỀ TÀI: WEBSITE MUA BÁN VẬT PHẨM, TÀI SẢN ẢO ONLINE, TIN CẬY (VD: GAME'S ITEMS, ACCOUNTS, CD-KEY,...)

### 📘 Hướng Dẫn Sử Dụng
#### 1. Cài Đặt Docker
- Tải và cài đặt Docker tại: [https://www.docker.com/](https://www.docker.com/)
#### 2. Chạy Project
2.1 Backend  
- Mở terminal và điều hướng đến thư mục gốc của project  
- Chạy lệnh sau để khởi động backend:
```bash
docker compose up -d
```

2.2 Frontend
- Điều hướng đến thư mục `frontend/web`
- Cài đặt các package cần thiết:
```bash
  npm install
```
- Chạy ứng dụng frontend:
```bash
  npm run dev
```
## Phân công công việc thành viên:

| **STT** | **Thành viên**         | **Nhiệm vụ**                                                                 | **Tiến độ** |
|---------|------------------------|-------------------------------------------------------------------------------|-------------|
| 1       | Nguyễn Thanh             | Gateway Service, Order Service, Buying Service, Notification Service, Search Service, Frontend | 100% |
| 2       | Nguyễn Nhất Dương         | Auction Service, Bidding Service, Frontend | 100% |
| 3       | Nguyễn Hoàng Phúc            | Identity Service, Wallet Service, Frontend | 100% |
| 4       | Huỳnh Anh Khôi           | Auction Service, Bidding Service, Frontend | 100% |
---

## Công nghệ sử dụng:
- **Ngôn ngữ lập trình**: C#, TypeScript  
- **Framework**: ASP.NET Core, Next.js  
- **Cơ sở dữ liệu**: PostgreSQL, MongoDB  
- **Công cụ thiết kế**: Figma  
- **Container**: Docker  
- **Message Broker**: RabbitMQ

---

## Tính năng:
1. **Đăng nhập/Đăng ký:**:
- Đăng ký tài khoản mới.
- Đăng nhập vào hệ thống.
- Quản lý thông tin tài khoản.

2. **Ví điện tử:**:
- Nạp tiền vào ví.
- Rút tiền từ ví.
- Kiểm tra số dư và lịch sử giao dịch.

3. **Mua sản phẩm:**:
- Tìm kiếm và lọc sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Thanh toán đơn hàng.

4. **Bán sản phẩm:**:
- Đăng bán sản phẩm mới.
- Quản lý sản phẩm đã đăng.
- Xử lý đơn hàng từ người mua.

5. **Đấu giá trực tuyến:**:
- Tạo phiên đấu giá sản phẩm.
- Tham gia đấu giá theo thời gian thực.
- Theo dõi kết quả đấu giá.
---