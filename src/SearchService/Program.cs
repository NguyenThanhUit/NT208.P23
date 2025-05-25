using OrderService;
using Polly.Extensions.Http;
using Polly;
using MassTransit;
using System.Net;
using SearchService;
using SearchService.Consumers;
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
builder.Services.AddMassTransit(x =>
{
    //Them consumer
    x.AddConsumersFromNamespaceContaining<OrderCreatedConsumer>();
    x.AddConsumersFromNamespaceContaining<OrderUpdatedConsumer>();
    x.AddActivitiesFromNamespaceContaining<BuyingPlacedConsumer>();


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
// Sử dụng thư viện Polly qua NuGet Microsoft.Extensions.Http.Polly

// Phương thức trả về một chính sách retry bất đồng bộ cho các yêu cầu HTTP
static IAsyncPolicy<HttpResponseMessage> GetPolicy()
    => HttpPolicyExtensions
        // Xử lý các lỗi tạm thời (transient errors) như timeout, 5xx lỗi máy chủ
        .HandleTransientHttpError()

        // Thêm điều kiện: cũng thử lại nếu gặp lỗi 404 (Not Found)
        .OrResult(static msg => msg.StatusCode == HttpStatusCode.NotFound)

        // Chính sách thử lại mãi mãi (không giới hạn số lần retry)
        // Mỗi lần thử lại sẽ chờ 3 giây
        .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));

