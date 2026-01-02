using MongoDB.Entities;

namespace WalletService.Models;

public class Wallet : Entity
{
    public string UserId { get; set; } = string.Empty;
    public int Balance { get; set; } = 0;
}
