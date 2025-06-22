using Contracts;
using MassTransit;
using MongoDB.Entities;
using WalletService.Models;

namespace WalletService
{
    public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
    {
        public async Task Consume(ConsumeContext<AuctionFinished> context)
        {
            var message = context.Message;

            Console.WriteLine($">>> [Consumer] Nhận event AuctionFinished:");
            Console.WriteLine($"    ➤ AuctionID: {message.AuctionID}");
            Console.WriteLine($"    ➤ Winner: {message.Winner}");
            Console.WriteLine($"    ➤ Seller: {message.Seller}");
            Console.WriteLine($"    ➤ Amount: {message.Amount}");
            Console.WriteLine($"    ➤ ItemSold: {message.ItemSold}");

            if (!message.ItemSold)
            {
                Console.WriteLine("⚠️ Vật phẩm không được bán, không cần xử lý thanh toán.");
                return;
            }

            if (string.IsNullOrEmpty(message.Winner) || message.Amount == null || message.Amount <= 0)
            {
                Console.WriteLine(" Dữ liệu không hợp lệ: thiếu Winner hoặc Amount.");
                return;
            }

            var wallet = await DB.Find<Wallet>()
                                 .Match(w => w.UserId == message.Winner)
                                 .ExecuteSingleAsync();

            if (wallet == null)
            {
                Console.WriteLine($"Không tìm thấy ví của người dùng {message.Winner}.");
                return;
            }

            if (wallet.Balance >= message.Amount.Value)
            {
                wallet.Balance -= message.Amount.Value;
                await wallet.SaveAsync();

                Console.WriteLine($"Đã trừ {message.Amount} VND từ ví của {message.Winner}. Số dư còn lại: {wallet.Balance}");
            }
            else
            {
                Console.WriteLine($"Ví {message.Winner} không đủ tiền: có {wallet.Balance}, cần {message.Amount}.");
            }
        }
    }
}
