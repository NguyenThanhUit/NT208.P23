using Microsoft.EntityFrameworkCore;
using AuctionService.Entities;
namespace AuctionService.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        SeedData(scope.ServiceProvider.GetService<AuctionDbContext>());
    }

    private static void SeedData(AuctionDbContext context)
    {
        context.Database.Migrate();

        if (context.Auctions.Any())
        {
            Console.WriteLine("No need");
            return;
        }

        var auctions = new List<Auction>()
        {
            new Auction
            {
                ID = Guid.NewGuid(),
                reservePrice = 500,
                sellerID = "seller123",
                winnerID = "buyer456",
                currentHighBid = 600,
                createdAt = DateTime.UtcNow.AddDays(-5),
                updatedAt = DateTime.UtcNow,
                endAt = DateTime.UtcNow.AddDays(2),
                status = Status.Live,
                item = new Items
                {
                    ID = Guid.NewGuid(),
                    name = "Netflix account",
                    des = "",
                    category = "Movie Account",
                    price = 1200,
                    createdAt = DateTime.UtcNow.AddDays(-5),
                    modifiedAt = DateTime.UtcNow,
                    auctionID = Guid.NewGuid()
                }
            },
            new Auction
            {
                ID = Guid.NewGuid(),
                reservePrice = 1000,
                sellerID = "seller789",
                winnerID = "",
                currentHighBid = 900,
                createdAt = DateTime.UtcNow.AddDays(-10),
                updatedAt = DateTime.UtcNow,
                endAt = DateTime.UtcNow.AddDays(-1),
                status = Status.ReserveNotMet,
                item = new Items
                {
                    ID = Guid.NewGuid(),
                    name = "Steam account",
                    des = "",
                    category = "Game Account",
                    price = 1300,
                    createdAt = DateTime.UtcNow.AddDays(-10),
                    modifiedAt = DateTime.UtcNow,
                    auctionID = Guid.NewGuid()
                }
            },
            new Auction
            {
                ID = Guid.NewGuid(),
                reservePrice = 200,
                sellerID = "seller555",
                winnerID = "buyer999",
                currentHighBid = 300,
                createdAt = DateTime.UtcNow.AddDays(-3),
                updatedAt = DateTime.UtcNow,
                endAt = DateTime.UtcNow.AddDays(1),
                status = Status.Finished,
                item = new Items
                {
                    ID = Guid.NewGuid(),
                    name = "EpicGames account",
                    des = "",
                    category = "Game Account",
                    price = 350,
                    createdAt = DateTime.UtcNow.AddDays(-3),
                    modifiedAt = DateTime.UtcNow,
                    auctionID = Guid.NewGuid()
                }
            }
        };

        context.AddRange(auctions);
        context.SaveChanges();
    }
}