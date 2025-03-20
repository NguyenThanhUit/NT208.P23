
using MongoDB.Entities;
using SearchService;

namespace OrderService;

public class OrderSvcHttpClient
{
    private readonly IConfiguration _config; // Dùng để đọc cấu hình từ appsettings
    private readonly HttpClient _httpClient; // Để thực hiện các yêu cầu HTTP

    public OrderSvcHttpClient(IConfiguration config, HttpClient httpClient)
    {
        _config = config;
        _httpClient = httpClient;
    }

    // Phương thức đồng bộ để lấy danh sách Product từ OrderService
    public async Task<List<Product>> GetProductForSearch()
    {
        // Lấy danh sách sản phẩm mới nhất
        var lastUpdated = await DB.Find<Product>() // Không cần <Product, string>
                               .Sort(x => x.Descending(x => x.CreatedAt))
                               .ExecuteAsync();

        //Http request duoc gui tu OrderService
        var baseUrl = _config["OrderServiceURL"]; //Lấy từ appsettings
        var requestUrl = $"{baseUrl}/api/Orders?date={lastUpdated}";
        return await _httpClient.GetFromJsonAsync<List<Product>>(requestUrl);
    }
}
