namespace SearchService;
//Dung de thiet lap cac tinh nang tren 
public class SearchParams
{
    public string SearchTerm { get; set; }
    public int PageNumber { get; set; } = 1; //So luong trang
    public int PageSize { get; set; } = 15; //So luong Item trong 1 trang
    public string Seller { get; set; }
    public string Winner { get; set; }
    public string OrderBy { get; set; } //Dung de sap xep
    public string FilterBy { get; set; } //Dung de loc
    public int? MinPrice { get; set; }
    public int? MaxPrice { get; set; }
}