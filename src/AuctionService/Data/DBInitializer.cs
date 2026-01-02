using AuctionService.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class DBInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        SeedData(scope.ServiceProvider.GetService<AuctionDbContext>());
    }

    public static void SeedData(AuctionDbContext context)
    {
        Console.WriteLine("Starting database seeding...");

        if (context == null)
        {
            Console.WriteLine("Database context is null!");
            return;
        }

        context.Database.Migrate();

        if (context.Auctions.Any())
        {
            Console.WriteLine("Already have data");
            return;
        }

        var auctions = new List<Auction>() {
            new Auction
            {
                Id = Guid.NewGuid(),
                Status = Status.Live,
                ReservePrice = 500000,
                Seller = "admin",
                AuctionEnd = DateTime.UtcNow.AddDays(5),
                Item = new Item
                {
                    Name = "Elden Ring",
                    Description = "An epic action RPG from FromSoftware.",
                    Category = "Action RPG",
                    Year = 2022,
                    Key = "ELDEN-RING-2022-KEY",
                    ImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg"
                }
            },
            new Auction
            {
                Id = Guid.NewGuid(),
                Status = Status.Live,
                ReservePrice = 350000,
                Seller = "alice",
                AuctionEnd = DateTime.UtcNow.AddDays(7),
                Item = new Item
                {
                    Name = "Cyberpunk 2077",
                    Description = "Futuristic open-world RPG by CD Projekt Red.",
                    Category = "RPG",
                    Year = 2020,
                    Key = "CYBER-2077-KEY-001",
                    ImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg"
                }
            },
            new Auction
            {
                Id = Guid.NewGuid(),
                Status = Status.Live,
                ReservePrice = 600000,
                Seller = "bob",
                AuctionEnd = DateTime.UtcNow.AddDays(10),
                Item = new Item
                {
                    Name = "Red Dead Redemption 2",
                    Description = "Western-themed action-adventure game by Rockstar.",
                    Category = "Action Adventure",
                    Year = 2019,
                    Key = "RDR2-KEY-ROCKSTAR",
                    ImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg"
                }
            },
            new Auction
            {
                Id = Guid.NewGuid(),
                Status = Status.Live,
                ReservePrice = 450000,
                Seller = "tom",
                AuctionEnd = DateTime.UtcNow.AddDays(15),
                Item = new Item
                {
                    Name = "Resident Evil Village",
                    Description = "Survival horror game from Capcom.",
                    Category = "Horror",
                    Year = 2021,
                    Key = "RE-VILLAGE-2021-CAPCOM",
                    ImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1196590/header.jpg"
                }
            },
            new Auction
            {
                Id = Guid.NewGuid(),
                Status = Status.Live,
                ReservePrice = 400000,
                Seller = "alice",
                AuctionEnd = DateTime.UtcNow.AddDays(20),
                Item = new Item
                {
                    Name = "God of War (PC)",
                    Year = 2022,
                    Key = "GOW-2022-SONY-PC",
                    Description = "Mythological action-adventure game featuring Kratos.",
                    Category = "Action Adventure",
                    ImageUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg"
                }
            }
        };

        context.AddRange(auctions);
        context.SaveChanges();
    }
}
