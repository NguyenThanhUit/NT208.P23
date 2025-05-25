using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using WalletService.Models;

namespace WalletService.Controllers;

[ApiController]
[Route("api/wallets")]
public class WalletsController : ControllerBase
{
    [Authorize]
    [HttpPost("deposit")]
    public async Task<IActionResult> Deposit([FromBody] DepositRequest request)
    {
        try
        {
            var userId = User.Identity?.Name;
            Console.WriteLine($"[Deposit] Nhận request từ userId: {userId}");
            Console.WriteLine($"[Deposit] Dữ liệu gửi lên: UserId={request.UserId}, Amount={request.Amount}");

            if (userId == null)
                return Unauthorized(new { message = "Bạn chưa đăng nhập." });

            var wallet = await DB.Find<Wallet>()
                                 .Match(w => w.UserId == userId)
                                 .ExecuteFirstAsync();

            if (wallet == null)
            {
                wallet = new Wallet
                {
                    UserId = userId,
                    Balance = 0
                };
            }

            if (request.Amount <= 0)
                return BadRequest(new { message = "Số tiền nạp phải lớn hơn 0." });

            wallet.Balance += request.Amount;
            await DB.SaveAsync(wallet);

            Console.WriteLine($"[Deposit] Nạp thành công. Số dư mới: {wallet.Balance}");

            return Ok(new { message = "Nạp tiền thành công", balance = wallet.Balance });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Deposit] Lỗi khi nạp tiền: {ex}");
            return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
        }
    }




    [HttpGet("{userId}")]
    public async Task<IActionResult> GetWallet(string userId)
    {
        var wallet = await DB.Find<Wallet>()
                             .Match(w => w.UserId == userId)
                             .ExecuteFirstAsync();

        if (wallet == null)
            return NotFound(new { message = "Ví không tồn tại" });

        return Ok(new
        {
            userId = wallet.UserId,
            balance = wallet.Balance
        });
    }
}

public class DepositRequest
{
    public string UserId { get; set; }
    public int Amount { get; set; }
}
