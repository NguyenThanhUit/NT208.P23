using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace SearchService.Consumers;

public class ProductDeletedConsumer : IConsumer<ProductDeleted>
{
    public async Task Consume(ConsumeContext<ProductDeleted> context)
    {
        var result = await DB.DeleteAsync<Product>(context.Message.Id);
        if (!result.IsAcknowledged)
            throw new MessageException(typeof(ProductDeleted), "Problem deleting order");
    }
}