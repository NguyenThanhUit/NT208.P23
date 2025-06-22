using AuctionService;
using AuctionService.Data;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
//Thêm mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddDbContext<AuctionDbContext>(opt => opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<AuctionFinishedConsumer>();
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

        option.Authority = builder.Configuration["IdentityServiceUrl"];


        option.RequireHttpsMetadata = false;


        option.TokenValidationParameters.ValidateAudience = false;

        option.TokenValidationParameters.NameClaimType = "username";
    });


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
