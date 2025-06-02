using AuctionService.Data;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
//Thêm mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddDbContext<AuctionDbContext>(opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//Thêm mass transit
builder.Services.AddMassTransit(x =>
{
    //Message outbox có tác dụng lưu trữ message khi service bus down
    // x.AddEntityFrameworkOutbox<AuctionDbContext> (o =>{
    //     o.QueryDelay = TimeSpan.FromSeconds(10);
    //     o.UsePostgres();
    //     o.UseBusOutbox();
    // });

    x.UsingRabbitMq((context, cfg) =>
    {

        //Thêm để dùng khi chạy Dockerfile
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        cfg.ConfigureEndpoints(context);
    });
});

//Add authenticate(Identity Service)
// Cấu hình xác thực bằng JWT Bearer Token
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

//Add grpc
builder.Services.AddGrpc();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseAuthentication();
app.UseAuthorization();

app.MapGrpcService<GrpcAuctionService>();

builder.WebHost.UseUrls("http://*:80");


app.MapControllers();

try
{
    DBInitializer.InitDb(app);
}
catch (Exception e)
{
    Console.WriteLine(e.Message);
}

app.Run();
