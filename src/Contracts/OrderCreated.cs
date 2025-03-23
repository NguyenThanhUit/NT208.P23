﻿namespace Contracts;

public class OrderCreated
{
    public Guid Id { get; set; }
    public decimal TotalPrice { get; set; }
    public string Buyer { get; set; }
    public string Seller { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int? SoldAmount { get; set; }
    public string Status { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; }
    public string ImageUrl { get; set; }
    public int StockQuantity { get; set; }

}