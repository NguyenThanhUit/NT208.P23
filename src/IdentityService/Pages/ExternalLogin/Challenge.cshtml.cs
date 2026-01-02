// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.

using Duende.IdentityServer.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace IdentityService.Pages.ExternalLogin;

[AllowAnonymous]
[SecurityHeaders]
public class Challenge : PageModel
{
    private readonly IIdentityServerInteractionService _interactionService;

    public Challenge(IIdentityServerInteractionService interactionService)
    {
        _interactionService = interactionService;
    }

    public IActionResult OnPost(string scheme, string? returnUrl)
    {
        if (string.IsNullOrEmpty(returnUrl)) returnUrl = "~/";

        // validate returnUrl - either it is a valid OIDC URL or back to a local page
        if (Url.IsLocalUrl(returnUrl) == false && _interactionService.IsValidReturnUrl(returnUrl) == false)
        {
            // user might have clicked on a malicious link - should be logged
            throw new ArgumentException("invalid return URL");
        }

        // start challenge and roundtrip the return URL and scheme 
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Page("/ExternalLogin/Callback"), // /signin-google /ExternalLogin/Callback

            Items =
            {
                { "scheme", scheme },
                { "returnUrl", returnUrl }
            }
        };
        // Challenge là một phương thức của ASP.NET Core Authentication, kích hoạt luồng OAuth với Google.
        return Challenge(properties, scheme);
    }
}