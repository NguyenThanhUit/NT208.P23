import NextAuth, { Profile } from "next-auth";
import { OIDCConfig } from "next-auth/providers";
import DuendeIDS6Provider from "next-auth/providers/duende-identity-server6"

export const { handlers, signIn, auth } = NextAuth({
    // Cấu hình session
    session: {
        strategy: 'jwt' // Dùng JWT thay vì session lưu trên server
    },
    providers: [
        DuendeIDS6Provider({
            id: 'id-server', // Định danh duy nhất của provider (dùng khi gọi signIn('id-server'))
            clientId: "nextApp", // Client ID được cấu hình trong IdentityServer (ứng dụng Next.js)
            clientSecret: "secret", // Client Secret dùng để xác thực client với IdentityServer
            issuer: "http://localhost:5001", // Đường dẫn đến IdentityServer (máy chủ xác thực)
            authorization: { // Cấu hình yêu cầu thêm thông tin gì khi xác thực
                params: {
                    scope: 'openid profile email address orderApp' // Các scope yêu cầu: 
                    // openid: bắt buộc theo OIDC, cung cấp ID token
                    // profile: để lấy thông tin người dùng (tên, email,...)
                    // auctionApp: scope tùy chỉnh của bạn (có thể cho phép truy cập API riêng)
                }
            },
        } as OIDCConfig<Omit<Profile, 'username'>>), // Ép kiểu theo OIDCConfig (loại bỏ 'username' để tránh xung đột)
    ],
    callbacks: {
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl
        },
        async authorized({ auth }) {
            return !!auth
        },
        async jwt({ token, profile, account }) {
            if (account && account.access_token) {
                token.accessToken = account.access_token
            }
            if (profile) {
                token.username = profile.username
                token.email = profile.email
                token.address = profile.address
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.username = token.username;
                session.accessToken = token.accessToken;
                // session.user.email = token.email;
                // session.user.address = token.address;
            }
            return session;
        }
    }

});

