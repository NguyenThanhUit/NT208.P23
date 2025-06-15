using OrderService.Entities;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetService<OrderDbContext>();
        SeedData(context);
    }

    public static void SeedData(OrderDbContext context)
    {
        Console.WriteLine("Starting database seeding...");

        if (context == null)
        {
            Console.WriteLine("Database context is null");
            return;
        }

        try
        {
            context.Database.Migrate();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database migration error: {ex.Message}");
            return;
        }

        if (context.Products.Any())
        {
            Console.WriteLine("Already have data");
            return;
        }

        var products = new List<Product>
{
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "GTA V",
        Description = "Action open world game",
        Price = 89000,
        Category = "Action",
        ImageUrl = "https://cdn.pixabay.com/photo/2023/04/17/14/36/ai-generated-7932616_1280.jpg",
        StockQuantity = 1,
        Key = "GTA-V-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "CSGO",
        Description = "Multiplayer first-person shooter",
        Price = 129000,
        Category = "Shooter",
        ImageUrl = "https://i.pinimg.com/474x/a1/39/a4/a139a4fc8994a34275c17aeea9e50fe7.jpg",
        StockQuantity = 1,
        Key = "CSGO-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Dota 2",
        Description = "Online multiplayer battle arena",
        Price = 799000,
        Category = "Strategy",
        ImageUrl = "https://i.pinimg.com/474x/b0/3a/9a/b03a9ab25a3e9449a6bc4645f97ba213.jpg",
        StockQuantity = 1,
        Key = "DOTA2-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "PUBG",
        Description = "Battle royale shooter",
        Price = 199000,
        Category = "Shooter",
        ImageUrl = "https://i.pinimg.com/474x/51/6a/74/516a74d6d701c86c007f668d7cf2891a.jpg",
        StockQuantity = 1,
        Key = "PUBG-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "NARAKA",
        Description = "Action-adventure melee combat",
        Price = 149000,
        Category = "Action",
        ImageUrl = "https://i.pinimg.com/736x/6f/f6/b4/6ff6b40a0d7c7c59428603129fd4f2a7.jpg",
        StockQuantity = 1,
        Key = "NARAKA-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "RUST",
        Description = "Survival game with crafting",
        Price = 199000,
        Category = "Adventure",
        ImageUrl = "https://i.pinimg.com/474x/07/61/aa/0761aa4b3ef67b90a666f8b1da12648f.jpg",
        StockQuantity = 1,
        Key = "RUST-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Dead by Daylight",
        Description = "Multiplayer horror survival",
        Price = 79000,
        Category = "Horror",
        ImageUrl = "https://i.pinimg.com/736x/9d/c8/4c/9dc84c7cfde98e444f4d7e3345792e8e.jpg",
        StockQuantity = 1,
        Key = "DBD-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Apex Legends",
        Description = "Battle royale FPS",
        Price = 129000,
        Category = "Shooter",
        ImageUrl = "https://i.pinimg.com/736x/27/f6/12/27f612230d8e16a14e95f6368b2b5cf0.jpg",
        StockQuantity = 1,
        Key = "APEX-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Black Myth: Wukong",
        Description = "Mythical action RPG",
        Price = 59000,
        Category = "RPG",
        ImageUrl = "https://i.pinimg.com/474x/24/75/93/247593454f25aea68e5d4157016d1f4c.jpg",
        StockQuantity = 1,
        Key = "WUKONG-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Valheim",
        Description = "Survival RPG in Viking world",
        Price = 299000,
        Category = "RPG",
        ImageUrl = "https://i.pinimg.com/474x/95/c4/b6/95c4b6cae9bf1183a9aab5470275c8fc.jpg",
        StockQuantity = 1,
        Key = "VALHEIM-KEY",
        SearchCount = 0,
        ProductStatus = "Available"
    }
};


        context.Products.AddRange(products);
        context.SaveChanges();

        var orders = new List<Order>
        {
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[0].Price * 2,
                Buyer = "Nguyen Thanh",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 2,
                ProductId = products[0].Id,
                Product = products[0],
                Status = Status.Pending
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[1].Price,
                Buyer = "John Doe",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 1,
                ProductId = products[1].Id,
                Product = products[1],
                Status = Status.Pending
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[2].Price,
                Buyer = "Jane Smith",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 1,
                ProductId = products[2].Id,
                Product = products[2],
                Status = Status.Completed
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[3].Price,
                Buyer = "Alice Johnson",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 1,
                ProductId = products[3].Id,
                Product = products[3],
                Status = Status.Pending
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[4].Price * 3,
                Buyer = "Bob Brown",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 3,
                ProductId = products[4].Id,
                Product = products[4],
                Status = Status.Pending
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[5].Price,
                Buyer = "Charlie White",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 1,
                ProductId = products[5].Id,
                Product = products[5],
                Status = Status.Pending
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[6].Price,
                Buyer = "David Green",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 1,
                ProductId = products[6].Id,
                Product = products[6],
                Status = Status.Pending
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[7].Price,
                Buyer = "Emma Blue",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 1,
                ProductId = products[7].Id,
                Product = products[7],
                Status = Status.Completed
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[8].Price * 2,
                Buyer = "Frank Black",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 2,
                ProductId = products[8].Id,
                Product = products[8],
                Status = Status.Pending
            },
            new Order
            {
                Id = Guid.NewGuid(),
                TotalPrice = products[9].Price,
                Buyer = "Grace Red",
                Seller = "admin",
                CreatedAt = DateTime.UtcNow,
                SoldAmount = 1,
                ProductId = products[9].Id,
                Product = products[9],
                Status = Status.Pending
            }
        };

        context.Orders.AddRange(orders);
        context.SaveChanges();

        Console.WriteLine("Database seeding completed.");
    }
}
