using Contracts;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using OrderService.Data;


namespace OrderService
{
    public class BuyingItemConsumer : IConsumer<BuyingPlaced>
    {
        private readonly OrderDbContext _dbContext;

        public BuyingItemConsumer(OrderDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Consume(ConsumeContext<BuyingPlaced> context)
        {
            Console.WriteLine("-> Consuming buying placed");

            // Log chi tiết thông tin tiêu thụ
            Console.WriteLine($"Received message: OrderID = {context.Message.orderID}, ProductName = {context.Message.ProductName}, Buyer = {context.Message.Buyer}, TotalAmount = {context.Message.TotalAmount}");

            // Tìm sản phẩm theo tên hoặc sử dụng ProductId nếu có
            var product = await _dbContext.Products
                .FirstOrDefaultAsync(p => p.Name == context.Message.ProductName);

            if (product == null)
            {
                Console.WriteLine($"Product with name '{context.Message.ProductName}' not found");
                return;  // Nếu không tìm thấy sản phẩm, không giảm số lượng
            }

            // In ra thông tin sản phẩm trước khi giảm số lượng
            Console.WriteLine($"Product before update: Name = {product.Name}, Stock Quantity = {product.StockQuantity}");

            // Giảm số lượng tồn kho
            product.StockQuantity = product.StockQuantity - context.Message.Quantity;



            // In ra thông tin sản phẩm sau khi giảm số lượng
            Console.WriteLine($"Product after update: Name = {product.Name}, Stock Quantity = {product.StockQuantity}");

            // Lưu thay đổi vào cơ sở dữ liệu
            await _dbContext.SaveChangesAsync();
            Console.WriteLine("Changes saved to the database.");
        }
    }
}