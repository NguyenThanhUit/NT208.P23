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
## Đóng góp vào đồ án của các thành viên

| **STT** | **Thành viên**         | **Đóng góp**                                                                 | **%** |
|---------|------------------------|-------------------------------------------------------------------------------|-------------|
| 1       | Nguyễn Thanh             | Gateway Service, Order Service, Buying Service, Notification Service, Search Service, Frontend | 40% |
| 2       | Nguyễn Nhất Dương         | Auction Service, Bidding Service, Frontend | 20% |
| 3       | Nguyễn Hoàng Phúc            | Identity Service, Wallet Service, Frontend | 20% |
| 4       | Huỳnh Anh Khôi           | Auction Service, Bidding Service, Frontend | 20% |
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
## 🚀 Tính năng chính

### 🔐 Xác thực & Quản lý người dùng (Identity Service)
- Hỗ trợ **đăng ký, đăng nhập** bằng tài khoản hệ thống hoặc qua **Google OAuth2**.
- Tích hợp **xác thực đa yếu tố** thông qua **email** và **số điện thoại**.
- Bảo mật thông tin người dùng với hệ thống xác thực hiện đại.

### 💳 Ví điện tử (Wallet Service)
- Hỗ trợ **nạp tiền** thông qua **VNPAY (sandbox)**.
- Quản lý **số dư ví**, **lịch sử giao dịch** minh bạch.


### 🛒 Mua sản phẩm (Order & Escrow System)
- Tìm kiếm, lọc sản phẩm, thêm vào giỏ hàng, và thanh toán dễ dàng.
- **Hệ thống Escrow bảo vệ người mua**:
  - Sau khi thanh toán, người mua sẽ nhận được **key sản phẩm**.
  - Nếu **key sai hoặc không hợp lệ**, tiền sẽ được **hoàn lại (refund)** cho người mua.
  - Nếu **key đúng**, tiền sẽ được **chuyển cho người bán**.
- Tính năng **đánh giá người bán** sau giao dịch.
- Xem **bảng xếp hạng người bán** dựa trên điểm đánh giá và số lượt bán.

### 🛍️ Bán sản phẩm
- Đăng bán sản phẩm mới với thông tin đầy đủ: tên, mô tả, giá, hình ảnh, số lượng,...
- Quản lý sản phẩm đã đăng bán.
- Xử lý đơn hàng từ người mua: xác nhận key, giao hàng, nhận tiền thông qua **escrow**.

### 🏆 Đấu giá trực tuyến
- Tạo các phiên đấu giá với thông tin chi tiết và thời gian kết thúc.
- Tham gia **đấu giá thời gian thực**, cập nhật giá tự động.
- Khi đấu giá kết thúc:
  - Người thắng nhận **key sản phẩm**.
  - Áp dụng **hệ thống Escrow** như phần mua hàng:
    - Nếu **key đúng**, tiền được chuyển cho người bán.
    - Nếu **key sai**, người thắng được **hoàn tiền**.

---

> 🔒 **Lưu ý**: Hệ thống Escrow được thiết kế nhằm đảm bảo **sự an toàn và công bằng** cho cả người mua và người bán.
