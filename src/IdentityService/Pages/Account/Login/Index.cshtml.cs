// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.

using Duende.IdentityServer;
using Duende.IdentityServer.Events;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Duende.IdentityServer.Stores;
using IdentityService.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text;

namespace IdentityService.Pages.Login;

[SecurityHeaders]
[AllowAnonymous]
public class Index : PageModel
{
    // Tạo / Lấy thông tin người dùng từ CSDL
    private readonly UserManager<ApplicationUser> _userManager;

    // Hỗ trợ đăng nhập (kiểm tra username, password)
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IIdentityServerInteractionService _interaction;
    private readonly IEventService _events;
    private readonly IAuthenticationSchemeProvider _schemeProvider;
    private readonly IIdentityProviderStore _identityProviderStore;

    // Gửi email 
    private readonly IEmailSender _emailSender;

    // Gửi SMS
    private readonly ISMSSender _smsSender;

    public ViewModel View { get; set; } = default!;

    // 
    [BindProperty]
    public InputModel Input { get; set; } = default!;

    public Index(
        IIdentityServerInteractionService interaction,
        IAuthenticationSchemeProvider schemeProvider,
        IIdentityProviderStore identityProviderStore,
        IEventService events,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IEmailSender emailSender,
        ISMSSender smsSender)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _interaction = interaction;
        _schemeProvider = schemeProvider;
        _identityProviderStore = identityProviderStore;
        _events = events;
        _emailSender = emailSender;
        _smsSender = smsSender;
    }

    public async Task<IActionResult> OnGet(string? returnUrl)
    {
        await BuildModelAsync(returnUrl);

        if (View.IsExternalLoginOnly)
        {
            // we only have one option for logging in and it's an external provider
            return RedirectToPage("/ExternalLogin/Challenge", new { scheme = View.ExternalLoginScheme, returnUrl });
        }

        return Page();
    }

    // Thực hiện khi gửi form
    public async Task<IActionResult> OnPost()
    {
        // check if we are in the context of an authorization request
        var context = await _interaction.GetAuthorizationContextAsync(Input.ReturnUrl);

        if (Input.Button != "LogIn")
        {
            if (context != null)
            {
                // This "can't happen", because if the ReturnUrl was null, then the context would be null
                ArgumentNullException.ThrowIfNull(Input.ReturnUrl, nameof(Input.ReturnUrl));

                // if the user cancels, send a result back into IdentityServer as if they 
                // denied the consent (even if this client does not require consent).
                // this will send back an access denied OIDC error response to the client.
                await _interaction.DenyAuthorizationAsync(context, AuthorizationError.AccessDenied);

                // we can trust model.ReturnUrl since GetAuthorizationContextAsync returned non-null
                if (context.IsNativeClient())
                {
                    // The client is native, so this change in how to
                    // return the response is for better UX for the end user.
                    return this.LoadingPage(Input.ReturnUrl);
                }

                return Redirect(Input.ReturnUrl ?? "~/");
            }
            // Go back to the home page
            else return Redirect("~/");
        }


        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByNameAsync(Input.Username!);
            if (user != null)
            {
                // Kiểm tra username và password mà không đăng nhập ngay
                var result = await _userManager.CheckPasswordAsync(user, Input.Password!);
                if (result)
                {
                    // Nếu xác thực username, password thành công: gửi OTP
                    // Tạo mã OTP 6 chữ số
                    string OTP = GenerateOTP();
                    user.OTPCode = OTP;
                    user.OTPExpiry = DateTime.UtcNow.AddMinutes(5);
                    await _userManager.UpdateAsync(user);

                    // Gửi email
                    if (Input.VerificationMethod == "Email")
                    {
                        await _emailSender.SendEmail(
                            user.Email,
                            "Xác thực tài khoản E-Shop",
                            $"Mã OTP của bạn là: {OTP}. Mã sẽ hết hạn sau 5 phút."
                        );
                    }
                    // Gửi SMS
                    else if (Input.VerificationMethod == "SMS")
                    {
                        await _smsSender.SendSMS(
                            user.PhoneNumber,
                            $"Xác thực tài khoản E-Shop. Mã OTP của bạn là: {OTP}. Mã sẽ hết hạn sau 5 phút."
                        );
                    }

                    return RedirectToPage("/Account/Verify/Index", new
                    {
                        returnUrl = Input.ReturnUrl,
                        username = Input.Username,
                        rememberLogin = Input.RememberLogin,
                        verificationMethod = Input.VerificationMethod
                    });
                }
            }
        }

        const string error = "invalid credentials";
        await _events.RaiseAsync(new UserLoginFailureEvent(Input.Username, error, clientId: context?.Client.ClientId));
        Telemetry.Metrics.UserLoginFailure(context?.Client.ClientId, IdentityServerConstants.LocalIdentityProvider, error);
        ModelState.AddModelError(string.Empty, LoginOptions.InvalidCredentialsErrorMessage);

        // Nếu có lỗi, tải lại trang và hiển thị lỗi
        await BuildModelAsync(Input.ReturnUrl);
        return Page();
    }

    private string GenerateOTP()
    {
        Random random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    private async Task BuildModelAsync(string? returnUrl)
    {
        Input = new InputModel
        {
            ReturnUrl = returnUrl
        };

        var context = await _interaction.GetAuthorizationContextAsync(returnUrl);
        if (context?.IdP != null && await _schemeProvider.GetSchemeAsync(context.IdP) != null)
        {
            var local = context.IdP == Duende.IdentityServer.IdentityServerConstants.LocalIdentityProvider;

            // this is meant to short circuit the UI and only trigger the one external IdP
            View = new ViewModel
            {
                EnableLocalLogin = local,
            };

            Input.Username = context.LoginHint;

            if (!local)
            {
                View.ExternalProviders = new[] { new ViewModel.ExternalProvider(authenticationScheme: context.IdP) };
            }

            return;
        }

        var schemes = await _schemeProvider.GetAllSchemesAsync();

        var providers = schemes
            .Where(x => x.DisplayName != null)
            .Select(x => new ViewModel.ExternalProvider
            (
                authenticationScheme: x.Name,
                displayName: x.DisplayName ?? x.Name
            )).ToList();

        var dynamicSchemes = (await _identityProviderStore.GetAllSchemeNamesAsync())
            .Where(x => x.Enabled)
            .Select(x => new ViewModel.ExternalProvider
            (
                authenticationScheme: x.Scheme,
                displayName: x.DisplayName ?? x.Scheme
            ));
        providers.AddRange(dynamicSchemes);


        var allowLocal = true;
        var client = context?.Client;
        if (client != null)
        {
            allowLocal = client.EnableLocalLogin;
            if (client.IdentityProviderRestrictions != null && client.IdentityProviderRestrictions.Count != 0)
            {
                providers = providers.Where(provider => client.IdentityProviderRestrictions.Contains(provider.AuthenticationScheme)).ToList();
            }
        }

        View = new ViewModel
        {
            AllowRememberLogin = LoginOptions.AllowRememberLogin,
            EnableLocalLogin = allowLocal && LoginOptions.AllowLocalLogin,
            ExternalProviders = providers.ToArray()
        };
    }
}