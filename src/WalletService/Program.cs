using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MongoDB.Driver;
using MongoDB.Entities;
using VNPAY.NET;
using WalletService;
using WalletService.Consumers;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddSingleton<IVnpay, Vnpay>();
builder.Services.AddMassTransit(x =>
{

    x.AddConsumersFromNamespaceContaining<BuyingItemConsumer>();
    x.AddConsumersFromNamespaceContaining<AuctionFinishedConsumer>();
    x.AddConsumersFromNamespaceContaining<AuctionKeyConfirmedConsumer>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("deposits", false));

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


// Đăng ký các dịch vụ
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(option =>
    {
        option.Authority = builder.Configuration["IdentityServiceUrl"];
        option.RequireHttpsMetadata = false;
        option.TokenValidationParameters.ValidateAudience = false;
        option.TokenValidationParameters.NameClaimType = "username";
    });

// Sau khi cấu hình xong services, mới được gọi Build()
var app = builder.Build();

// Khởi tạo MongoDB.Entities
await DB.InitAsync("DepositDb", MongoClientSettings.FromConnectionString(builder.Configuration.GetConnectionString("DepositDbConnection")));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
