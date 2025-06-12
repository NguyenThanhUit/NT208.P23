using System.Reflection.Emit;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService;

[Route("api/search")]
[ApiController]
public class SearchController : ControllerBase
{
    [HttpGet("products")]
    public async Task<ActionResult<List<Product>>> SearchItem([FromQuery] SearchParams searchParams)
    {
        var query = DB.PagedSearch<Product, Product>();

        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query = query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();
        }

        query = searchParams.OrderBy switch
        {
            "priceascending" => query.Sort(x => x.Ascending(a => a.Price)),
            "pricedescending" => query.Sort(x => x.Descending(a => a.Price)),
            "new" => query.Sort(x => x.Descending(a => a.CreatedAt)),
            _ => query.Sort(x => x.Ascending(a => a.CreatedAt))
        };

        query = searchParams.FilterBy switch
        {
            "Action" => query.Match(x => x.Category == "Action"),
            "Adventure" => query.Match(x => x.Category == "Adventure"),
            "RPG" => query.Match(x => x.Category == "RPG"),
            "Simulation" => query.Match(x => x.Category == "Simulation"),
            "Strategy" => query.Match(x => x.Category == "Strategy"),
            "Sports" => query.Match(x => x.Category == "Sports"),
            "Puzzle" => query.Match(x => x.Category == "Puzzle"),
            "Racing" => query.Match(x => x.Category == "Racing"),
            "Horror" => query.Match(x => x.Category == "Horror"),
            "Shooter" => query.Match(x => x.Category == "Shooter"),
            _ => query
        };
        if (searchParams.MinPrice.HasValue)
        {
            query = query.Match(x => x.Price >= searchParams.MinPrice.Value);
        }

        if (searchParams.MaxPrice.HasValue)
        {
            query = query.Match(x => x.Price <= searchParams.MaxPrice.Value);
        }
        query.PageNumber(searchParams.PageNumber);
        query.PageSize(searchParams.PageSize);

        var result = await query.ExecuteAsync();


        return Ok(new
        {
            data = result.Results,
            total = result.TotalCount,
            pageCount = result.PageCount
        });
    }
    [HttpGet("auctions")]
    public async Task<ActionResult<List<Item>>> SearchAuctionItem([FromQuery] SearchParams searchParams)
    {

        var query = DB.PagedSearch<Item, Item>();


        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();
        }


        //Sap xep
        query = searchParams.OrderBy switch
        {
            "name" => query.Sort(x => x.Ascending(a => a.Name)).Sort(x => x.Ascending(a => a.Year)),
            "new" => query.Sort(x => x.Descending(a => a.CreatedAt)),
            _ => query.Sort(x => x.Ascending(a => a.AuctionEnd))
        };
        //Loc
        query = searchParams.FilterBy switch
        {
            "finished" => query.Match(x => x.AuctionEnd < DateTime.UtcNow),
            "endingSoon" => query.Match(x => x.AuctionEnd < DateTime.UtcNow.AddHours(6) && x.AuctionEnd > DateTime.UtcNow),
            _ => query.Match(x => x.AuctionEnd > DateTime.UtcNow)
        };

        if (!string.IsNullOrEmpty(searchParams.Seller))
        {
            query.Match(x => x.Seller == searchParams.Seller);
        }
        if (!string.IsNullOrEmpty(searchParams.Winner))
        {
            query.Match(x => x.Winner == searchParams.Winner);
        }
        if (searchParams.MinPrice.HasValue)
        {
            query = query.Match(x => x.SoldAmount >= searchParams.MinPrice.Value);
        }

        if (searchParams.MaxPrice.HasValue)
        {
            query = query.Match(x => x.SoldAmount <= searchParams.MaxPrice.Value);
        }


        //So trang
        query.PageNumber(searchParams.PageNumber);

        //Kich thuoc trang
        query.PageSize(searchParams.PageSize);

        var result = await query.ExecuteAsync();


        return Ok(new
        {
            results = result.Results, // Danh sách các mục tìm thấy
            pageCount = result.PageCount, // Tổng số trang
            totalCount = result.TotalCount // Tổng số mục
        });
    }
}
