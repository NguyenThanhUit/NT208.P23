using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/search")]
[ApiController]
public class SearchController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Product>>> SearchItem([FromQuery] SearchParams searchParams)
    {
        var query = DB.PagedSearch<Product, Product>();

        // Tìm kiếm full-text nếu có searchTerm
        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query = query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();
        }

        // Sắp xếp
        query = searchParams.OrderBy switch
        {
            "priceascending" => query.Sort(x => x.Ascending(a => a.Price)), 
            "pricedescending" => query.Sort(x => x.Descending(a => a.Price)), 
            "new" => query.Sort(x => x.Descending(a => a.CreatedAt)), 
            _ => query.Sort(x => x.Ascending(a => a.CreatedAt))
        };



        // Thực hiện truy vấn
        var result = await query.ExecuteAsync();

        // Trả về JSON đúng format
        return Ok(new
        {
            data = result.Results,  // Danh sách sản phẩm
            total = result.TotalCount // Tổng số sản phẩm tìm được
        });
    }
}
