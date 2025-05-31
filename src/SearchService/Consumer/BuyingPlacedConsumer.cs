using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService.Consumers;

public class BuyingPlacedConsumer : IConsumer<BuyingPlaced>
{
    public async Task Consume(ConsumeContext<BuyingPlaced> context)
    {
        var message = context.Message;
        var product = await DB.Find<Product>()
                                 .Match(w => w.Name == message.ProductName)
                                 .ExecuteSingleAsync();
        if (product == null)
        {
            Console.WriteLine("Khong tim thay san pham");
        }
        product.StockQuantity = product.StockQuantity - message.Quantity;
        await product.SaveAsync();
    }
}