using MongoDB.Driver;
using MongoDB.Entities;
using OrderService;
using SearchService;

public class DbInitializers
{
    public static async Task InitDb(WebApplication app)
    {
        await DB.InitAsync("SearchDB", MongoClientSettings.FromConnectionString(app.Configuration.GetConnectionString("MongoDbConnection")));
        //Chỉ mục cho việc tìm kiếm
        await DB.Index<Product>()
            .Key(x => x.Name, KeyType.Text)
            .CreateAsync();

        using var scope = app.Services.CreateScope();
        var httpClient = scope.ServiceProvider.GetService<OrderSvcHttpClient>();
        var products = await httpClient.GetProductForSearch();
        if (products.Count > 0) await DB.SaveAsync(products);

    }
}