using Duende.IdentityServer.Models;

namespace IdentityService;

public static class Config
{
    // Tập hợp các claims (thông tin về người dùng như ID, tên, email) mà IdentityServer có thể trả về trong ID token sau khi xác thực.
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        { 
            // OpenId, Profile sẽ được nhúng vào ID token để cung cấp thông tin người dùng cho client.
            new IdentityResources.OpenId(),  // Cho phép lấy thông tin định danh cơ bản của người dùng (subject identifier)
            new IdentityResources.Profile(), // Cho phép lấy thông tin hồ sơ người dùng (họ tên, email, ...)
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
                AllowedScopes = {"openid", "profile", "orderApp"},
                RedirectUris = {"https://www.getpostman.com/oauth2/callback"},
                ClientSecrets = new[] {new Secret("NotASecret".Sha256())},
                AllowedGrantTypes = {GrantType.ResourceOwnerPassword}
            },
            new Client
            {
                ClientId = "nextApp", // Client ID của app Next.js
                ClientName = "nextApp", // Tên app hiển thị

                // Bí mật của client, dùng để xác thực client
                // Client (nextApp) phải cung cấp bí mật này khi thực hiện các flow như Code flow hoặc Client Credentials.
                ClientSecrets = { new Secret("secret".Sha256()) },
                
                // Sử dụng 2 luồng: 
                // Code flow dùng để xác thực người dùng qua app frontend (nextApp)
                // Client Credentials (cho app server-to-server) giúp backend của nextApp gọi API của orderApp (scope orderApp).
                AllowedGrantTypes = GrantTypes.CodeAndClientCredentials,
                
                // Cho phép/không yêu cầu Proof Key for Code Exchange (PKCE)
                RequirePkce = false,
                
                // URL callback của nextApp sau khi xác thực thành công (Auth.js hoặc NextAuth)
                RedirectUris = { "http://localhost:3001/api/auth/callback/id-server" },
                
                // Cho phép client yêu cầu refresh token, dùng để làm mới access token mà không cần người dùng đăng nhập lại.
                AllowOfflineAccess = true, 
                
                // Các phạm vi mà client này có thể truy cập
                AllowedScopes = { "openid", "profile", "orderApp" },
                
                // Thời gian sống của access token (30 ngày = 3600s * 24h * 30d)
                AccessTokenLifetime = 3600 * 24 * 30,
                AlwaysIncludeUserClaimsInIdToken = true, //Lay ID token
            }
        };
}
