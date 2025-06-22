using Contracts;
using MassTransit;
using MongoDB.Entities;
using WalletService.Models;

namespace WalletService
{
    public class BuyingItemConsumer : IConsumer<BuyingPlaced>
    {
        public async Task Consume(ConsumeContext<BuyingPlaced> context)
        {
            var message = context.Message;

            Console.WriteLine($">>> [Consumer] Nhận event BuyingPlaced: OrderID = {message.orderID}, Buyer = {message.Buyer}, Amount = {message.TotalAmount}");

            var wallet = await DB.Find<Wallet>()
                                 .Match(w => w.UserId == message.Buyer)
                                 .ExecuteSingleAsync();

            if (wallet == null)
            {
                Console.WriteLine($"Không tìm thấy ví cho user {message.Buyer}");
                return;
            }

            if (wallet.Balance >= message.TotalAmount)
            {
                wallet.Balance -= message.TotalAmount;
                await wallet.SaveAsync();

                Console.WriteLine($"Đã trừ {message.TotalAmount} từ ví của {message.Buyer}. Số dư còn lại: {wallet.Balance}");
            }
            else
            {
                Console.WriteLine($"Không đủ số dư trong ví của {message.Buyer}. Yêu cầu: {message.TotalAmount}, hiện có: {wallet.Balance}");

            }
        }
    }
}
