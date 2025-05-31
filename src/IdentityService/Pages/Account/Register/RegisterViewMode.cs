using System.ComponentModel.DataAnnotations;

namespace IdentityService.Pages.Register;

public class RegisterViewModel
{
    public Guid ID { get; set; }

    [Required]
    public string? UserName { get; set; }

    [Required]
    public string? PassWord { get; set; }

    [Required]
    public string? FullName { get; set; }
    public string? Address { get; set; }

    [Required]
    public string? Email { get; set; }

    [Required]
    public string? Telephone { get; set; }
    public string? VerificationMethod { get; set; }
    public string? ReturnUrl { get; set; }
    public string? Button { get; set; }

    // Thêm trường nhập mã OTP
    public string? OTPCode { get; set; }

}