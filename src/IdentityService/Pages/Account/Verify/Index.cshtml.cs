using Duende.IdentityServer;
using Duende.IdentityServer.Events;
using Duende.IdentityServer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using IdentityService.Models;

namespace IdentityService.Pages.Verify;

[SecurityHeaders]
[AllowAnonymous]
public class Index : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IIdentityServerInteractionService _interaction;
    private readonly IEventService _events;

    [BindProperty]
    public VerifyInputModel Input { get; set; } = default!;
    public string? ErrorMessage { get; set; }

    public Index(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IIdentityServerInteractionService interaction,
        IEventService events)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _interaction = interaction;
        _events = events;
    }

    // Lấy returnUrl và username từ form đăng nhập / đăng ký
    public IActionResult OnGet(string? returnUrl, string? username, string verificationMethod, bool rememberLogin = false)
    {
        Input = new VerifyInputModel
        {
            // Gán từ query parameter
            ReturnUrl = returnUrl,
            Username = username,
            RememberLogin = rememberLogin,
            VerificationMethod = verificationMethod,
        };
        return Page();
    }

    // Xử lý khi nhấn xác thực 
    public async Task<IActionResult> OnPost()
    {
        var context = await _interaction.GetAuthorizationContextAsync(Input.ReturnUrl);

        // Giải quyết trường hợp chưa nhập OTP
        if (string.IsNullOrEmpty(Input.OTPCode))
        {
            ErrorMessage = "Vui lòng nhập mã xác thực OTP";
            return Page();
        }

        var user = await _userManager.FindByNameAsync(Input.Username!);

        // Kiểm tra mã OTP nhập vào có khớp với OTP đã tạo hay không
        // Kiểm tra thời hạn của mã OTP
        if (user.OTPCode == Input.OTPCode && user.OTPExpiry > DateTime.UtcNow)
        {
            // Cập nhật phương thức xác thực
            if (Input.VerificationMethod == "Email")
                user.EmailConfirmed = true;
            else if (Input.VerificationMethod == "SMS")
                user.PhoneNumberConfirmed = true;

            // Xóa thông tin OTP sau khi xác thực
            user.OTPCode = "";
            user.OTPExpiry = null;
            await _userManager.UpdateAsync(user);

            await _signInManager.SignInAsync(user, Input.RememberLogin);
            await _events.RaiseAsync(new UserLoginSuccessEvent(user.UserName, user.Id, user.UserName, clientId: context?.Client.ClientId));
            Telemetry.Metrics.UserLogin(context?.Client.ClientId, IdentityServerConstants.LocalIdentityProvider);

            if (context != null)
            {
                if (context.IsNativeClient())
                {
                    return this.LoadingPage(Input.ReturnUrl);
                }
                return Redirect(Input.ReturnUrl ?? "~/");
            }

            if (Url.IsLocalUrl(Input.ReturnUrl))
            {
                return Redirect(Input.ReturnUrl);
            }
            return Redirect("~/");
        }
        else
        {
            // Tạo thông báo lỗi
            ErrorMessage = "Mã OTP không đúng hoặc đã hết hạn.";
            return Page();
        }
    }
}