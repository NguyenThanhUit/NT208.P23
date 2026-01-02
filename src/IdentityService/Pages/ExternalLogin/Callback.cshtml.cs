// Copyright (c) Duende Software. All rights reserved.
// See LICENSE in the project root for license information.

using System.Security.Claims;
using Duende.IdentityServer;
using Duende.IdentityServer.Events;
using Duende.IdentityServer.Services;
using IdentityModel;
using IdentityService.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace IdentityService.Pages.ExternalLogin;

using System.Text.Json;

[AllowAnonymous]
[SecurityHeaders]
public class Callback : PageModel
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IIdentityServerInteractionService _interaction;
    private readonly ILogger<Callback> _logger;
    private readonly IEventService _events;

    public Callback(
        IIdentityServerInteractionService interaction,
        IEventService events,
        ILogger<Callback> logger,
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _interaction = interaction;
        _logger = logger;
        _events = events;
    }

    public async Task<IActionResult> OnGet()
    {
        // 1. Xác thực từ cookie tạm
        var result = await HttpContext.AuthenticateAsync(IdentityServerConstants.ExternalCookieAuthenticationScheme);
        if (!result.Succeeded || result.Principal == null)
            throw new InvalidOperationException("External authentication failed");

        ClaimsPrincipal externalUser = result.Principal;
        string provider = result.Properties.Items["scheme"] ?? "";
        Claim userIdClaim = externalUser.FindFirst(JwtClaimTypes.Subject) ?? externalUser.FindFirst(ClaimTypes.NameIdentifier)
            ?? throw new InvalidOperationException("Cannot determine external user ID");
        var providerUserId = userIdClaim.Value;

        // 2. Kiểm tra xem user đã tồn tại chưa
        var user = await _userManager.FindByLoginAsync(provider, providerUserId);

        // Chưa sẽ lấy thông tin người dùng từ tài khoản Google
        if (user == null)
        {
            // Lấy access token
            var accessToken = result.Properties.GetTokenValue("access_token");

            string fullName = externalUser.FindFirst(ClaimTypes.Name)?.Value ?? "";
            string email = externalUser.FindFirst(ClaimTypes.Email)?.Value ?? "";
            string userName = email.Split("@")[0];
            string phoneNumber = "";
            string address = "";

            if (!string.IsNullOrEmpty(accessToken))
            {
                using var http = new HttpClient();
                http.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                var peopleApiUrl = "https://people.googleapis.com/v1/people/me?personFields=names,phoneNumbers,addresses";
                var response = await http.GetAsync(peopleApiUrl);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var json = JsonDocument.Parse(content);

                    // Full Name (từ Google People API)
                    fullName = json.RootElement.GetProperty("names")[0].GetProperty("displayName").GetString() ?? "";

                    // Phone Number
                    if (json.RootElement.TryGetProperty("phoneNumbers", out var phones))
                        phoneNumber = phones[0].GetProperty("value").GetString() ?? "";

                    // Address
                    if (json.RootElement.TryGetProperty("addresses", out var addrs))
                        address = addrs[0].GetProperty("formattedValue").GetString() ?? "";
                }
            }

            // 3. Tạo đối tượng user
            user = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = userName,
                Email = email,
                EmailConfirmed = true,
                PhoneNumber = phoneNumber,
                Address = address,
                FullName = fullName
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
                throw new Exception("Không thể tạo người dùng mới: " + createResult.Errors.First().Description);

            await _userManager.AddLoginAsync(user, new UserLoginInfo(provider, providerUserId, provider));

            // Thêm claim 
            var claims = new List<Claim>();
            if (fullName != null)
                claims.Add(new Claim(JwtClaimTypes.Name, fullName));
            if (email != null)
                claims.Add(new Claim(JwtClaimTypes.Email, email));
            if (claims.Count > 0)
                await _userManager.AddClaimsAsync(user, claims);
        }

        // 4. Đăng nhập & redirect
        var additionalClaims = new List<Claim>();
        var signInProps = new AuthenticationProperties();
        CaptureExternalLoginContext(result, additionalClaims, signInProps);

        await _signInManager.SignInWithClaimsAsync(user, signInProps, additionalClaims);
        await HttpContext.SignOutAsync(IdentityServerConstants.ExternalCookieAuthenticationScheme);

        var returnUrl = result.Properties.Items["returnUrl"] ?? "~/";
        return Redirect(returnUrl);
    }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Performance", "CA1851:Possible multiple enumerations of 'IEnumerable' collection", Justification = "<Pending>")]
    private async Task<ApplicationUser> AutoProvisionUserAsync(string provider, string providerUserId, IEnumerable<Claim> claims)
    {
        var sub = Guid.NewGuid().ToString();

        var user = new ApplicationUser
        {
            Id = sub,
            UserName = sub, // don't need a username, since the user will be using an external provider to login
        };

        // email
        var email = claims.FirstOrDefault(x => x.Type == JwtClaimTypes.Email)?.Value ??
                    claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        if (email != null)
        {
            user.Email = email;
        }

        // create a list of claims that we want to transfer into our store
        var filtered = new List<Claim>();

        // user's display name
        var name = claims.FirstOrDefault(x => x.Type == JwtClaimTypes.Name)?.Value ??
                   claims.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value;
        if (name != null)
        {
            filtered.Add(new Claim(JwtClaimTypes.Name, name));
        }
        else
        {
            var first = claims.FirstOrDefault(x => x.Type == JwtClaimTypes.GivenName)?.Value ??
                        claims.FirstOrDefault(x => x.Type == ClaimTypes.GivenName)?.Value;
            var last = claims.FirstOrDefault(x => x.Type == JwtClaimTypes.FamilyName)?.Value ??
                       claims.FirstOrDefault(x => x.Type == ClaimTypes.Surname)?.Value;
            if (first != null && last != null)
            {
                filtered.Add(new Claim(JwtClaimTypes.Name, first + " " + last));
            }
            else if (first != null)
            {
                filtered.Add(new Claim(JwtClaimTypes.Name, first));
            }
            else if (last != null)
            {
                filtered.Add(new Claim(JwtClaimTypes.Name, last));
            }
        }

        var identityResult = await _userManager.CreateAsync(user);
        if (!identityResult.Succeeded) throw new InvalidOperationException(identityResult.Errors.First().Description);

        if (filtered.Count != 0)
        {
            identityResult = await _userManager.AddClaimsAsync(user, filtered);
            if (!identityResult.Succeeded) throw new InvalidOperationException(identityResult.Errors.First().Description);
        }

        identityResult = await _userManager.AddLoginAsync(user, new UserLoginInfo(provider, providerUserId, provider));
        if (!identityResult.Succeeded) throw new InvalidOperationException(identityResult.Errors.First().Description);

        return user;
    }

    // if the external login is OIDC-based, there are certain things we need to preserve to make logout work
    // this will be different for WS-Fed, SAML2p or other protocols
    private static void CaptureExternalLoginContext(AuthenticateResult externalResult, List<Claim> localClaims, AuthenticationProperties localSignInProps)
    {
        ArgumentNullException.ThrowIfNull(externalResult.Principal, nameof(externalResult.Principal));

        // capture the idp used to login, so the session knows where the user came from
        localClaims.Add(new Claim(JwtClaimTypes.IdentityProvider, externalResult.Properties?.Items["scheme"] ?? "unknown identity provider"));

        // if the external system sent a session id claim, copy it over
        // so we can use it for single sign-out
        var sid = externalResult.Principal.Claims.FirstOrDefault(x => x.Type == JwtClaimTypes.SessionId);
        if (sid != null)
        {
            localClaims.Add(new Claim(JwtClaimTypes.SessionId, sid.Value));
        }

        // if the external provider issued an id_token, we'll keep it for signout
        var idToken = externalResult.Properties?.GetTokenValue("id_token");
        if (idToken != null)
        {
            localSignInProps.StoreTokens(new[] { new AuthenticationToken { Name = "id_token", Value = idToken } });
        }
    }
}