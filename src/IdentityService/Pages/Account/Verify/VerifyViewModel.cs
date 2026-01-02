namespace IdentityService.Pages.Verify;

public class VerifyInputModel
{
    public string? Username { get; set; }
    public string? OTPCode { get; set; }
    public string? ReturnUrl { get; set; }
    public bool RememberLogin { get; set; }

    // Xác định phương thức xác thực
    public string VerificationMethod { get; set; }
}