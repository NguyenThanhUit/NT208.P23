using AuctionService.Data;
using Microsoft.EntityFrameworkCore;
using MassTransit.EntityFrameworkCoreIntegration;
using MassTransit.ExtensionsDependencyInjectionIntegration; // Thường dùng cho DI extension
using AuctionService;
using MassTransit;
using MassTransit.ExtensionsDependencyInjectionIntegration.Registration;
using AuctionService.Entities;
using AuctionService.RequestHelpers;
using AuctionService.DTOs;

using Contracts;
using Consumers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();
builder.Services.AddDbContext<AuctionDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddMassTransit(x => 
    {
        x.AddEntityFrameworkOutbox<AuctionDbContext>(o =>
        {
            o.QueryDelay = TimeSpan.FromSeconds(10);
            o.UsePostgres();
            o.UseBusOutbox();
        });

        x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();
        
        x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));

        x.UsingRabbitMq((context, cfg) =>
        {
            cfg.ConfigureEndpoints(context);
        });
    }
);

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:3000");
    });
});

var app = builder.Build();

app.UseCors("CorsPolicy");

app.UseAuthorization();
app.MapControllers();
try
{
    DbInitializer.InitDb(app);
}
catch (Exception e)
{
    Console.WriteLine(e); 
}

app.Run();