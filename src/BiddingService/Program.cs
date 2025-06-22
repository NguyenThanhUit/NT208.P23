using BiddingServices;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MongoDB.Driver;
using MongoDB.Entities;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
//Thêm mass transit
builder.Services.AddMassTransit(x =>
{
    //Them consumer
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
    //Message outbox có tác dụng lưu trữ message khi service bus down
    // x.AddEntityFrameworkOutbox<AuctionDbContext> (o =>{
    //     o.QueryDelay = TimeSpan.FromSeconds(10);
    //     o.UsePostgres();
    //     o.UseBusOutbox();
    // });

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("bids", false));
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

        option.Authority = builder.Configuration["IdentityServiceUrl"];


        option.RequireHttpsMetadata = false;


        option.TokenValidationParameters.ValidateAudience = false;


        option.TokenValidationParameters.NameClaimType = "username";
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();


builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());


builder.Services.AddScoped<GrpcAuctionClient>();


builder.Services.AddHostedService<CheckAuctionFinished>();

var app = builder.Build();
app.UseRouting();

app.UseAuthentication();


app.UseAuthorization();

app.MapControllers();

await DB.InitAsync("BidDb", MongoClientSettings.FromConnectionString(builder.Configuration.GetConnectionString("BidDbConnection")));

app.Run();
