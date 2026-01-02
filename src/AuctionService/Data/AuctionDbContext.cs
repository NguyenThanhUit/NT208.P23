using AuctionService.Entities;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions options) : base(options)
    {

    }
    public DbSet<Auction> Auctions { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        // base.OnModelCreating(modelBuilder);
        // modelBuilder.AddInboxStateEntity();
        // modelBuilder.AddOutboxMessageEntity();
        // modelBuilder.AddOutboxStateEntity();

        // Cấu hình quan hệ 1-1 giữa Auction và Item
        modelBuilder.Entity<Auction>()
            .HasOne(a => a.Item)
            .WithOne(i => i.Auction)
            .HasForeignKey<Item>(i => i.AuctionId); // Chỉ rõ khóa ngoại trong Item
    }

}