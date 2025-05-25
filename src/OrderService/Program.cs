using OrderService.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using MassTransit;
using OrderService;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Đăng ký AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Đăng ký Controllers
builder.Services.AddControllers();

// Đăng ký DbContext
builder.Services.AddDbContext<OrderDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký MassTransit **trước khi gọi builder.Build()**
builder.Services.AddMassTransit(x =>
{
    // Kích hoạt Message Outbox để đảm bảo độ tin cậy
    // x.AddEntityFrameworkOutbox<OrderDbContext>(o =>
    // {
    //     o.QueryDelay = TimeSpan.FromSeconds(10);
    //     o.UsePostgres();
    //     o.UseBusOutbox();
    // });
    x.AddConsumersFromNamespaceContaining<BuyingItemConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        cfg.ConfigureEndpoints(context);
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    // Thêm JWT Bearer handler để xử lý token
    .AddJwtBearer(option =>
    {
        // Đặt Authority - URL của IdentityServer để xác thực token
        option.Authority = builder.Configuration["IdentityServiceUrl"];

        // Cho phép sử dụng HTTP (không HTTPS), tiện cho môi trường phát triển
        option.RequireHttpsMetadata = false;

        // Bỏ qua kiểm tra audience (aud) - giúp token có thể dùng cho nhiều dịch vụ
        option.TokenValidationParameters.ValidateAudience = false;

        // Xác định tên người dùng dựa trên claim "username" trong token
        option.TokenValidationParameters.NameClaimType = "username";
    });

// Sau khi đăng ký dịch vụ xong, mới gọi `builder.Build()`
var app = builder.Build();

// Middleware
app.UseAuthentication();  // Đặt trước Authorization
app.UseAuthorization();
app.MapControllers();

// Khởi tạo database
try
{
    DbInitializer.InitDb(app);
}
catch (Exception e)
{
    Console.WriteLine($"Database Initialization Error: {e}");
}

// Chạy ứng dụng
app.Run();
