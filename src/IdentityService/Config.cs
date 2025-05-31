using Duende.IdentityServer.Models;

namespace IdentityService;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            // Allow accessing ID token and user's profile info
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
            new IdentityResources.Email(),
            new IdentityResources.Address(),
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new ApiScope("orderApp", "Order app full access"),
        };

    // request token
    public static IEnumerable<Client> Clients =>
        new Client[]
        {
            // Return access token, ID token contain user's information to the client
            // access token: key to request resources from resource server (auction API - auction service)
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
                ClientId = "nextApp", // Client ID của app Next.js
                ClientName = "nextApp", // Tên app hiển thị
                
                // Bí mật của client, dùng để xác thực client
                ClientSecrets = { new Secret("secret".Sha256()) },
                
                // Sử dụng grant types kết hợp Code flow (dùng cho app frontend) và Client Credentials (cho app server-to-server)
                AllowedGrantTypes = GrantTypes.CodeAndClientCredentials,
                
                // Cho phép/không yêu cầu Proof Key for Code Exchange (PKCE)
                RequirePkce = false,
                
                // URL callback của Next.js sau khi xác thực thành công (Auth.js hoặc NextAuth)
                RedirectUris = { "http://localhost:3000/api/auth/callback/id-server" },
                
                // Cho phép offline access để lấy refresh token
                AllowOfflineAccess = true, // <-- Sửa lỗi chính tả: AllowwOfflineAccess -> AllowOfflineAccess
                
                // Các phạm vi mà client này có thể truy cập
                AllowedScopes = { "openid", "profile","email", "address", "orderApp" },
                
                // Thời gian sống của access token (30 ngày = 3600s * 24h * 30d)
                AccessTokenLifetime = 3600 * 24 * 30,
                AlwaysIncludeUserClaimsInIdToken = true, //Lay ID token
            }
        };
}
