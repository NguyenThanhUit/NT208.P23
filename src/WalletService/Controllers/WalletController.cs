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

    [Authorize]
    [HttpPost("init/{userId}")]
    public async Task<IActionResult> InitializeWallet([FromRoute] string userId, [FromBody] WalletInitRequest data)
    {
        var loggedInUserId = User.Identity?.Name;
        if (loggedInUserId == null || loggedInUserId != userId)
            return Unauthorized(new { message = "Bạn chưa đăng nhập hoặc không có quyền." });

        var existingWallet = await DB.Find<Wallet>()
                                     .Match(w => w.UserId == userId)
                                     .ExecuteFirstAsync();

        if (existingWallet != null)
        {
            return Ok(new { message = "Ví đã tồn tại", balance = existingWallet.Balance });
        }

        var newWallet = new Wallet
        {
            UserId = userId,
            Balance = data.Balance
        };

        await DB.SaveAsync(newWallet);

        return Ok(new { message = "Ví đã được khởi tạo thành công", balance = newWallet.Balance });
    }
    [Authorize]
    [HttpPost("seller/deposit/{sellerId}")]
    public async Task<IActionResult> DepositToSeller([FromRoute] string sellerId, [FromBody] DepositRequest request)
    {
        try
        {
            var loggedInUserId = User.Identity?.Name;
            if (request.Amount <= 0)
                return BadRequest(new { message = "Số tiền cần phải lớn hơn 0." });

            var wallet = await DB.Find<Wallet>()
                                 .Match(w => w.UserId == sellerId)
                                 .ExecuteFirstAsync();

            if (wallet == null)
            {
                wallet = new Wallet
                {
                    UserId = sellerId,
                    Balance = 0
                };
            }

            wallet.Balance += request.Amount;
            await DB.SaveAsync(wallet);

            return Ok(new { message = "Số dư mới", balance = wallet.Balance });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DepositToSeller] Lỗi khi tăng số dư cho seller: {ex}");
            return StatusCode(500, new { message = $"Lỗi server: {ex.Message}" });
        }
    }

}
public class DepositRequest
{
    public int Amount { get; set; }
}
public class WalletInitRequest
{
    public int Balance { get; set; }
}