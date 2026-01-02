using MongoDB.Entities;

namespace SearchService;

public class AuctionSvcHTTPClient
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AuctionSvcHTTPClient(HttpClient httpClient, IConfiguration config)
    {
        _config = config;
        _httpClient = httpClient;
    }


    public async Task<List<Item>> GetItemForSearchDb()
    {

        var lastUpdated = await DB.Find<Item, string>()
            .Sort(x => x.Descending(x => x.UpdatedAt))
            .Project(x => x.UpdatedAt.ToString()) //
            .ExecuteFirstAsync();

        // // Gửi yêu cầu HTTP GET đến AuctionService với tham số date là lastUpdated
        // return await _httpClient.GetFromJsonAsync<List<Item>>(
        //     _config["AuctionServiceURL" + "api/auctions?date" + lastUpdated]
        // ); // AuctionServiceURL được định nghĩa trong appsettings


        //HTTP request được send từ AuctionServices
        var baseUrl = _config["AuctionServiceURL"];
        var requestUrl = $"{baseUrl}/api/auctions?date={lastUpdated}";

        return await _httpClient.GetFromJsonAsync<List<Item>>(requestUrl);

    }
}
