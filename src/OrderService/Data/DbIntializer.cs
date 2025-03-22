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
        Name = "Mechanical Keyboard",
        Description = "RGB Mechanical Gaming Keyboard",
        Price = 89.99m,
        Category = "Electronics",
        ImageUrl = "https://example.com/keyboard.jpg",
        StockQuantity = 30
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Wireless Headphones",
        Description = "Noise Cancelling Over-Ear Headphones",
        Price = 129.99m,
        Category = "Electronics",
        ImageUrl = "https://example.com/headphones.jpg",
        StockQuantity = 20
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Smartphone",
        Description = "Latest 5G smartphone with high-end features",
        Price = 799.99m,
        Category = "Electronics",
        ImageUrl = "https://example.com/smartphone.jpg",
        StockQuantity = 15
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Gaming Chair",
        Description = "Ergonomic gaming chair with lumbar support",
        Price = 199.99m,
        Category = "Furniture",
        ImageUrl = "https://example.com/chair.jpg",
        StockQuantity = 10
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Smart Watch",
        Description = "Fitness tracking smartwatch with heart rate monitor",
        Price = 149.99m,
        Category = "Electronics",
        ImageUrl = "https://example.com/smartwatch.jpg",
        StockQuantity = 25
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Gaming Laptop",
        Description = "High-performance gaming laptop with RTX 3080",
        Price = 1999.99m,
        Category = "Electronics",
        ImageUrl = "https://example.com/laptop.jpg",
        StockQuantity = 8
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "External Hard Drive",
        Description = "2TB USB-C external hard drive",
        Price = 79.99m,
        Category = "Accessories",
        ImageUrl = "https://example.com/hdd.jpg",
        StockQuantity = 40
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Wireless Router",
        Description = "Wi-Fi 6 high-speed router with mesh support",
        Price = 129.99m,
        Category = "Networking",
        ImageUrl = "https://example.com/router.jpg",
        StockQuantity = 18
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Bluetooth Speaker",
        Description = "Portable waterproof Bluetooth speaker",
        Price = 59.99m,
        Category = "Audio",
        ImageUrl = "https://example.com/speaker.jpg",
        StockQuantity = 22
    },
    new Product
    {
        Id = Guid.NewGuid(),
        Name = "Action Camera",
        Description = "4K action camera with image stabilization",
        Price = 299.99m,
        Category = "Cameras",
        ImageUrl = "https://example.com/camera.jpg",
        StockQuantity = 12
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
        Seller = "Tech Store",
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
        Seller = "Gadget Hub",
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
        Seller = "Smart Devices",
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
        Seller = "Gaming World",
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
        Seller = "Wearable Tech",
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
        Seller = "Laptop Store",
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
        Seller = "Storage Solutions",
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
        Seller = "Network Shop",
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
        Seller = "Audio Tech",
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
        Seller = "Camera Store",
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


        Console.WriteLine("Database seeding completed.");
    }
}
