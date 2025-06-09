# Báo cáo tổng quan về Auction Service và Gateway Service

## 1. Auction Service

### 1.1 Mô tả code và chức năng

Auction Service là một microservice được xây dựng bằng ASP.NET Core, cung cấp các API để quản lý phiên đấu giá. Các chức năng chính bao gồm:

- Lấy danh sách đấu giá (GET /api/auctions)
- Lấy chi tiết một phiên đấu giá theo ID (GET /api/auctions/{id})
- Tạo phiên đấu giá mới (POST /api/auctions)
- Cập nhật thông tin phiên đấu giá (PUT /api/auctions/{id})
- Xóa phiên đấu giá (DELETE /api/auctions/{id})

Service sử dụng Entity Framework Core để tương tác với cơ sở dữ liệu PostgreSQL, AutoMapper để ánh xạ dữ liệu, và MassTransit để giao tiếp bất đồng bộ qua RabbitMQ.

### 1.2 Cách hoạt động

- **Khởi động**: Service được khởi tạo trong file `Program.cs`, cấu hình các service như DbContext, AutoMapper, MassTransit, JWT Authentication, và gRPC.
- **Xác thực**: Sử dụng JWT Bearer Token để xác thực người dùng, lấy thông tin từ Identity Service.
- **Giao tiếp bất đồng bộ**: Khi tạo phiên đấu giá mới, service sẽ publish một message `AuctionCreated` qua RabbitMQ để các service khác (như Search Service) có thể cập nhật dữ liệu.
- **Cơ sở dữ liệu**: Lưu trữ thông tin phiên đấu giá trong PostgreSQL, sử dụng Entity Framework Core để thao tác CRUD.

### 1.3 Liên kết với các phần khác

- **Identity Service**: Xác thực người dùng thông qua JWT Bearer Token.
- **Search Service**: Nhận thông báo khi có phiên đấu giá mới được tạo, cập nhật dữ liệu tìm kiếm.
- **Gateway Service**: Định tuyến các request từ frontend đến Auction Service.

### 1.4 Liên kết với UI

Frontend (Next.js) tương tác với Auction Service thông qua các API call. Các file chính trong frontend liên quan đến Auction Service bao gồm:

- `frontend/web/app/auctions/page.tsx`: Hiển thị danh sách phiên đấu giá.
- `frontend/web/app/auctions/Listings.tsx`: Component hiển thị danh sách phiên đấu giá, gọi API để lấy dữ liệu.
- `frontend/web/app/auctions/details/[id]/page.tsx`: Hiển thị chi tiết một phiên đấu giá.
- `frontend/web/app/actions/auctionaction.ts`: Chứa các hàm gọi API đến Auction Service (thông qua Gateway).

## 2. Gateway Service

### 2.1 Mô tả code và chức năng

Gateway Service là một API Gateway được xây dựng bằng ASP.NET Core, sử dụng YARP (Yet Another Reverse Proxy) để định tuyến các request từ frontend đến các microservice khác. Chức năng chính của Gateway là:

- Định tuyến request dựa trên đường dẫn (path) và phương thức HTTP.
- Cấu hình CORS để cho phép frontend gọi API.
- Chuyển tiếp request đến các service tương ứng (Auction Service, Order Service, Search Service, Buying Service).

### 2.2 Cách hoạt động

- **Khởi động**: Service được khởi tạo trong file `Program.cs`, cấu hình CORS và reverse proxy từ file `appsettings.json`.
- **Cấu hình reverse proxy**: Trong `appsettings.json`, Gateway định nghĩa các route và cluster tương ứng với các service. Ví dụ, request đến `/auctions/{**catch-all}` sẽ được chuyển tiếp đến Auction Service (http://localhost:7004).
- **CORS**: Cho phép frontend gọi API từ bất kỳ nguồn nào (AllowAll).

### 2.3 Vai trò trung gian

Gateway đóng vai trò trung gian giữa frontend và các backend service, giúp:

- Tập trung xử lý request, giảm tải cho các service.
- Đơn giản hóa việc gọi API từ frontend, chỉ cần gọi đến một địa chỉ duy nhất.
- Dễ dàng thêm/sửa/xóa service mà không cần thay đổi cấu hình frontend.

## 3. Sơ đồ tổng quan luồng dữ liệu

```
Frontend (Next.js) -> Gateway Service -> Auction Service
                    -> Order Service
                    -> Search Service
                    -> Buying Service
```

Frontend gọi API thông qua Gateway, Gateway định tuyến request đến service tương ứng. Auction Service xử lý request, tương tác với cơ sở dữ liệu và gửi thông báo qua RabbitMQ nếu cần. 

## 4. Giải thích code

### 4.1 Auction Service

- **Program.cs**: File khởi tạo service, cấu hình các dependency như DbContext, AutoMapper, MassTransit, JWT Authentication, và gRPC. Sử dụng Entity Framework Core để kết nối với PostgreSQL, MassTransit để giao tiếp qua RabbitMQ.
- **Controllers/AuctionsController.cs**: Chứa các endpoint API để quản lý phiên đấu giá. Sử dụng Entity Framework Core để thao tác CRUD với cơ sở dữ liệu, AutoMapper để ánh xạ dữ liệu, và MassTransit để publish message khi tạo phiên đấu giá mới.
- **Entities/Auction.cs**: Định nghĩa model Auction, lưu trữ thông tin phiên đấu giá.
- **DTOs/AuctionDto.cs**: Định nghĩa DTO (Data Transfer Object) để truyền dữ liệu giữa API và frontend.
- **Data/AuctionDbContext.cs**: Định nghĩa DbContext, kết nối với cơ sở dữ liệu PostgreSQL.

### 4.2 Gateway Service

- **Program.cs**: File khởi tạo service, cấu hình CORS và reverse proxy từ file `appsettings.json`. Sử dụng YARP để định tuyến request.
- **appsettings.json**: Cấu hình reverse proxy, định nghĩa các route và cluster tương ứng với các service. Ví dụ, request đến `/auctions/{**catch-all}` sẽ được chuyển tiếp đến Auction Service (http://localhost:7004).

## 5. Microservice và Docker

### 5.1 Microservice

- **Khái niệm**: Microservice là kiến trúc phần mềm, chia ứng dụng thành các service nhỏ, độc lập, có thể triển khai riêng biệt. Mỗi service thực hiện một chức năng cụ thể, giao tiếp với nhau qua API hoặc message queue.
- **Ưu điểm**:
  - **Khả năng mở rộng**: Dễ dàng thêm/sửa/xóa service mà không ảnh hưởng đến toàn bộ hệ thống.
  - **Độc lập**: Mỗi service có thể sử dụng công nghệ, ngôn ngữ, cơ sở dữ liệu khác nhau.
  - **Khả năng phục hồi**: Nếu một service gặp sự cố, các service khác vẫn hoạt động bình thường.
- **Thách thức**:
  - **Phức tạp**: Quản lý nhiều service, giao tiếp giữa các service, xử lý lỗi, đồng bộ dữ liệu.
  - **Hiệu suất**: Giao tiếp giữa các service có thể gây độ trễ, tăng tải cho hệ thống.

### 5.2 Docker

- **Khái niệm**: Docker là nền tảng ảo hóa, cho phép đóng gói ứng dụng và các dependency vào một container, có thể chạy trên bất kỳ môi trường nào hỗ trợ Docker.
- **Ưu điểm**:
  - **Nhất quán**: Container chạy giống nhau trên mọi môi trường, giảm thiểu lỗi "works on my machine".
  - **Dễ triển khai**: Chỉ cần chạy lệnh `docker run` để khởi động container.
  - **Cô lập**: Mỗi container chạy độc lập, không ảnh hưởng đến các container khác.
- **Cách sử dụng**:
  - **Dockerfile**: Định nghĩa cách build image, cài đặt dependency, cấu hình môi trường.
  - **docker-compose.yaml**: Định nghĩa các service, network, volume, giúp quản lý nhiều container cùng lúc.
  - **Lệnh Docker**: `docker build` để build image, `docker run` để chạy container, `docker-compose up` để khởi động các service.

### 5.3 Triển khai Microservice với Docker

- **Mỗi service được đóng gói vào một container**:
  - Auction Service: `Dockerfile` trong thư mục `src/AuctionService`.
  - Gateway Service: `Dockerfile` trong thư mục `src/GatewayService`.
- **docker-compose.yaml**: Định nghĩa các service, network, volume, giúp quản lý các container cùng lúc. Ví dụ:
  ```yaml
  services:
    auction-service:
      build: ./src/AuctionService
      ports:
        - "7004:80"
    gateway-service:
      build: ./src/GatewayService
      ports:
        - "7000:80"
  ```
- **Lợi ích**:
  - **Dễ triển khai**: Chỉ cần chạy lệnh `docker-compose up` để khởi động toàn bộ hệ thống.
  - **Nhất quán**: Các service chạy trong môi trường giống nhau, giảm thiểu lỗi.
  - **Cô lập**: Mỗi service chạy trong container riêng, không ảnh hưởng đến các service khác. 