using OrderService.Entities;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Data;

public class DbInitializer
{
    public static void InitDb(WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        SeedData(scope.ServiceProvider.GetRequiredService<OrderDbContext>());
    }

    public static void SeedData(OrderDbContext context)
    {
        Console.WriteLine("Starting database seeding...");

        if (context.Database.GetPendingMigrations().Any())
        {
            context.Database.Migrate();
        }

        if (context.Products.Any())
        {
            Console.WriteLine("Database already has data.");
            return;
        }

        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = "Gaming Mouse",
            Description = "RGB Wireless Gaming Mouse",
            Price = 59.99m,
            Category = "Electronics",
            ImageUrl = "https://example.com/mouse.jpg",
            StockQuantity = 50
        };

        context.Products.Add(product);
        context.SaveChanges();

        var order = new Order
        {
            Id = Guid.NewGuid(),
            TotalPrice = product.Price * 1, // Tổng tiền dựa trên số lượng bán
            Buyer = "Nguyen Thanh",
            Seller = "Tech Store",
            CreatedAt = DateTime.UtcNow,
            SoldAmount = 1,
            ProductId = product.Id,
            Status = Status.Pending
        };

        context.Orders.Add(order);
        context.SaveChanges();

        Console.WriteLine("Database seeding completed.");
    }
}
