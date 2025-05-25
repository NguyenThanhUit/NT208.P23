namespace IdentityService.Pages.Verify;

public class VerifyInputModel
{
    public string? Username { get; set; }
    public string? OTPCode { get; set; }
    public string? ReturnUrl { get; set; }
    public bool RememberLogin { get; set; }

    // Biến kiểm tra đây là phần đăng nhập hay đăng ký
    public bool IsRegister { get; set; }
}