using MassTransit;
using NotificationService;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy
                .WithOrigins("https://app.nguyenth4nh.xyz")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });
builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();




    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("nt", false));
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


builder.Services.AddSignalR();

var app = builder.Build();
app.UseCors("AllowFrontend");
app.MapHub<NotificationHub>("/notifications");
app.Run();
