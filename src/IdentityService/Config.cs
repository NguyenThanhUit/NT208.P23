using Duende.IdentityServer.Models;

namespace IdentityService;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
            new IdentityResources.Address(),
            new IdentityResource(
                name: "custom.claims",
                displayName: "Custom Claims",
                userClaims: new[] {  "createdAt", "Id" }
            )
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new ApiScope("orderApp", "Order app full access"),
        };


    public static IEnumerable<Client> Clients(IConfiguration config) =>
        new Client[]
        {

            new Client
            {
                ClientId = "postman",
                ClientName = "Postman",
                AllowedScopes = {"openid", "profile", "auctionApp"},
                RedirectUris = {"https://www.getpostman.com/oauth2/callback"},
                ClientSecrets = new[] {new Secret("NotASecret".Sha256())},
                AllowedGrantTypes = {GrantType.ResourceOwnerPassword}
            },
            new Client
            {
                ClientId = "nextApp",
                ClientName = "nextApp",
                ClientSecrets = { new Secret("secret".Sha256()) },
                AllowedGrantTypes = GrantTypes.CodeAndClientCredentials,
                RequirePkce = false,
                RedirectUris = {config["ClientApp"] + "/api/auth/callback/id-server" },
                AllowOfflineAccess = true,
                AllowedScopes = { "openid", "profile","email", "address", "orderApp", "custom.claims" },
                // Thời gian sống của access token (30 ngày = 3600s * 24h * 30d)
                AccessTokenLifetime = 3600 * 24 * 30,
                AlwaysIncludeUserClaimsInIdToken = true, //Lay ID token
            }
        };
}
