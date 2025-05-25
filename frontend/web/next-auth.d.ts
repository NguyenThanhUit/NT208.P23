// Import NextAuth và các kiểu dữ liệu cần thiết
import NextAuth, { type DefaultSession } from "next-auth";
import { JWT } from 'next-auth/jwt';

// Mở rộng module "next-auth" để tuỳ chỉnh các kiểu dữ liệu
declare module "next-auth" {
    /**
     * Mở rộng kiểu Session của NextAuth
     * - Session: chứa thông tin về phiên đăng nhập (user, expires, v.v.)
     */
    interface Session {
        user: {
            username: string; // Thêm 'username' cho user (ngoài name, email, image mặc định)
        } & DefaultSession["user"]; // Giữ lại các thuộc tính mặc định của user (name, email, image)

        accessToken: string; // Thêm 'accessToken' để lưu token xác thực từ Identity Provider
    }

    /**
     * Mở rộng Profile để chứa thêm username
     * - Profile: nhận thông tin từ Identity Provider (như Duende IdentityServer)
     */
    interface Profile {
        username: string; // Thêm 'username' để lấy từ Profile sau khi đăng nhập
    }

    /**
     * Mở rộng User của NextAuth
     * - User: đại diện cho người dùng được xác thực, có thể lấy từ database hoặc provider
     */
    interface User {
        username: string; // Thêm 'username' cho đối tượng User
    }
}

// Mở rộng module "next-auth/jwt" để thêm trường mới vào JWT
declare module 'next-auth/jwt' {
    interface JWT {
        username: string; // Thêm 'username' vào JWT (JSON Web Token)
        accessToken: string; // Thêm 'accessToken' để lưu trữ token xác thực
    }
}
