using MongoDB.Entities;

namespace SearchService;

public class AuctionSvcHTTPClient
{
    private readonly IConfiguration _config; // Dùng để đọc các cấu hình từ appsettings
    private readonly HttpClient _httpClient; // Để thực hiện các yêu cầu HTTP

    // Constructor nhận vào HttpClient và IConfiguration
    public AuctionSvcHTTPClient(HttpClient httpClient, IConfiguration config)
    {
        _config = config;
        _httpClient = httpClient;
    }

    // Phương thức bất đồng bộ để lấy danh sách Item từ AuctionService
    public async Task<List<Item>> GetItemForSearchDb()
    {
        // Truy vấn MongoDB để tìm thời điểm cập nhật mới nhất của Item
        var lastUpdated = await DB.Find<Item, string>()
            .Sort(x => x.Descending(x => x.UpdatedAt)) // Sắp xếp giảm dần theo UpdatedAt
            .Project(x => x.UpdatedAt.ToString()) // Lấy giá trị UpdatedAt dưới dạng chuỗi
            .ExecuteFirstAsync(); // Lấy phần tử đầu tiên

        // // Gửi yêu cầu HTTP GET đến AuctionService với tham số date là lastUpdated
        // return await _httpClient.GetFromJsonAsync<List<Item>>(
        //     _config["AuctionServiceURL" + "api/auctions?date" + lastUpdated]
        // ); // AuctionServiceURL được định nghĩa trong appsettings


        //HTTP request được send từ AuctionServices
        var baseUrl = _config["AuctionServiceURL"]; // Lấy URL gốc từ cấu hình
        var requestUrl = $"{baseUrl}/api/auctions?date={lastUpdated}"; // Xây dựng URL hợp lệ

        return await _httpClient.GetFromJsonAsync<List<Item>>(requestUrl);

    }
}
