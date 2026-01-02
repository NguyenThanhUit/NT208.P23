using Contracts;
using MassTransit;
using MongoDB.Entities;
using WalletService.Models;
namespace WalletService.Consumers;

public class AuctionKeyConfirmedConsumer : IConsumer<AuctionKeyConfirmed>
{
    public async Task Consume(ConsumeContext<AuctionKeyConfirmed> context)
    {
        var message = context.Message;

        Console.WriteLine($">>> Nhận xác nhận key đấu giá {message.AuctionID} cho seller {message.Seller}");

        var sellerWallet = await DB.Find<Wallet>()
                                   .Match(w => w.UserId == message.Seller)
                                   .ExecuteSingleAsync();

        if (sellerWallet != null)
        {
            sellerWallet.Balance += (int)message.Amount;
            await sellerWallet.SaveAsync();

            Console.WriteLine($" Đã cộng {message.Amount} VND vào ví của người bán {message.Seller}");
        }
        else
        {
            Console.WriteLine($"⚠️ Không tìm thấy ví của người bán {message.Seller}");
        }
    }
}
