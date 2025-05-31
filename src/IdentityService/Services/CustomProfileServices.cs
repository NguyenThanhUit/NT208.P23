using System.Threading.Tasks;
using System.Security.Claims;

using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using IdentityModel;

namespace IdentityService
{
    // Tell Identity Service about CustomProfileService: HostingExtensions.cs

    // Request and add additional information to returned token
    public class CustomProfileService : IProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public CustomProfileService(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }
        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            // context.Subject (user's ID)
            var user = await _userManager.GetUserAsync(context.Subject);
            var existingClaims = await _userManager.GetClaimsAsync(user);

            // username - additional claim which is sent back with token
            var claims = new List<Claim>
            {
                new Claim("username", user.UserName),
                new Claim("email", user.Email ?? ""),       // thêm email
                new Claim("address", user.Address ?? ""),   // thêm address (nếu có)
                // new Claim("phone", user.PhoneNumber),
                // new Claim("phoneV", user.PhoneNumberConfirmed ? "true" : "false")
            };

            context.IssuedClaims.AddRange(claims);

            // user's fullname - additional claim which is sent back with token 
            context.IssuedClaims.Add(existingClaims.FirstOrDefault(x => x.Type == JwtClaimTypes.Name));
            // context.IssuedClaims.Add(existingClaims.FirstOrDefault(x => x.Type == JwtClaimTypes.Address));
            // context.IssuedClaims.Add(existingClaims.FirstOrDefault(x => x.Type == JwtClaimTypes.Email));

            // Add username & fullname to token
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            return Task.CompletedTask;
        }
    }
}
