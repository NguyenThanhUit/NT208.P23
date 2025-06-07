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


            var product = await DB.Find<Product>()
                                   .Match(p => p.ProductId == message.ProductId)
                                   .ExecuteFirstAsync();

            if (product != null)
            {
                product.Name = message.Name;
                product.Description = message.Description;
                product.Price = message.Price;
                product.ImageUrl = message.ImageUrl;
                product.Category = message.Category;
                product.Key = message.Key;

                await product.SaveAsync();
                Console.WriteLine($"[SearchService] Product updated:  with new stock:");
            }
            else
            {
                Console.WriteLine($"[SearchService] Product with Name {message.ProductId} not found.");
            }
        }
    }
}