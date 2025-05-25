// Xuất middleware từ file cấu hình xác thực (auth.js hoặc auth.ts)
export { auth as middleware } from "@/auth"

// Cấu hình cho middleware
export const config = {
    matcher: [
        '/session' // Các route cần áp dụng middleware, ở đây là /session
    ],
    pages: {
        signIn: '/api/auth/signin' // Trang đăng nhập tùy chỉnh nếu chưa đăng nhập
    }
};
