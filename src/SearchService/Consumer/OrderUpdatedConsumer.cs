using Contracts;
using MassTransit;
using MongoDB.Entities;
using MongoDB.Driver;

namespace SearchService.Consumers
{
    public class OrderUpdatedConsumer : IConsumer<OrderUpdated>
    {
        public async Task Consume(ConsumeContext<OrderUpdated> context)
        {
            var message = context.Message;
            Console.WriteLine($"[SearchService] Order updated: OrderId: {message.OrderId}, ProductId: {message.ProductId}, Quantity: {message.Quantity}");

            // Find the product in MongoDB with MongoDB.Entities
            var product = await DB.Find<Product>()
                                   .Match(p => p.Name == message.ProductId.ToString())
                                   .ExecuteFirstAsync(); // Changed to ExecuteFirstAsync

            if (product != null)
            {
                // Update stock quantity
                product.StockQuantity = message.Quantity;

                // Save changes to database
                await product.SaveAsync();
                Console.WriteLine($"[SearchService] Product updated: {product.Name} with new stock: {product.StockQuantity}");
            }
            else
            {
                Console.WriteLine($"[SearchService] Product with Name {message.ProductId} not found.");
            }
        }
    }
}