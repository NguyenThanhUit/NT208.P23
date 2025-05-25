
// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.
using Microsoft.AspNetCore.Identity;
namespace IdentityService.Models;

// Add profile data for application users by adding properties to the ApplicationUser class
// ApplicationUser: Dùng để lưu trữ thông tin người dùng thực tế trong CSDL
public class ApplicationUser : IdentityUser
{
    public string? FullName { get; set; }
    public string? Address { get; set; }
    public decimal WalletBalance { get; set; } = 0;
    public DateTime CreateAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}