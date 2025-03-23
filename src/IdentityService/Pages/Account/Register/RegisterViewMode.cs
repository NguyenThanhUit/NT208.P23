using System.ComponentModel.DataAnnotations;

namespace IdentityService;

// Lưu trữ dữ liệu từ form đăng ký mà người dùng nhập vào
public class RegisterViewModel
{
    public Guid ID {get; set;}

    [Required]
    public string? UserName {get; set;}

    [Required]
    public string? PassWord {get; set;}

    [Required]
    public string? FullName {get; set;}
    public string? Address {get; set;}
    public string? Email {get; set;}
    public string? Telephone {get; set;}
    public string? ReturnUrl {get; set;}
    public string? Button {get; set;}
}