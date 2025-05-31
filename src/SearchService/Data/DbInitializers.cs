using MongoDB.Driver;
using MongoDB.Entities;
using OrderService;
using SearchService;

public class DbInitializers
{
    public static async Task InitDb(WebApplication app)
    {
        await DB.InitAsync("SearchDB", MongoClientSettings.FromConnectionString(app.Configuration.GetConnectionString("MongoDbConnection")));


        await DB.Index<Product>()
            .Key(x => x.Name, KeyType.Text)
            .CreateAsync();


        await DB.Index<Item>()
            .Key(x => x.Name, KeyType.Text)
            .Key(x => x.Category, KeyType.Text)
            .Key(x => x.Year, KeyType.Text)
            .CreateAsync();

        using var scope = app.Services.CreateScope();

        //OrderService
        var orderHttpClient = scope.ServiceProvider.GetService<OrderSvcHttpClient>();
        var products = await orderHttpClient.GetProductForSearch();
        if (products?.Count > 0)
        {
            await DB.SaveAsync(products);
        }

        // AuctionService
        var auctionHttpClient = scope.ServiceProvider.GetService<AuctionSvcHTTPClient>();
        var items = await auctionHttpClient.GetItemForSearchDb();
        Console.WriteLine(items.Count + " items returned from auction service");
        if (items?.Count > 0)
        {
            await DB.SaveAsync(items);
        }
    }
}
