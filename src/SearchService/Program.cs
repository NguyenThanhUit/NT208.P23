using OrderService;
using Polly.Extensions.Http;
using Polly;
using MassTransit;
using System.Net;
using SearchService;
using SearchService.Consumers;
using Contracts;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();
builder.Services.AddControllers();

//Thêm mapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
// //Thêm HTTP client
builder.Services.AddHttpClient<OrderSvcHttpClient>().AddPolicyHandler(GetPolicy());
builder.Services.AddHttpClient<AuctionSvcHTTPClient>().AddPolicyHandler(GetPolicy());
builder.Services.AddMassTransit(x =>
{
    //Them consumer
    x.AddConsumersFromNamespaceContaining<OrderCreatedConsumer>();
    x.AddConsumersFromNamespaceContaining<OrderUpdatedConsumer>();
    x.AddActivitiesFromNamespaceContaining<BuyingPlacedConsumer>();
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();


    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));


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

var app = builder.Build();
app.UseAuthorization();
app.MapControllers();

app.Lifetime.ApplicationStarted.Register(async () =>
{
    try
    {
        await DbInitializers.InitDb(app);
    }
    catch (Exception e)
    {
        Console.WriteLine(e.Message);
    }
});
app.Run();



static IAsyncPolicy<HttpResponseMessage> GetPolicy()
    => HttpPolicyExtensions
        .HandleTransientHttpError()

        .OrResult(static msg => msg.StatusCode == HttpStatusCode.NotFound)

        .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));

