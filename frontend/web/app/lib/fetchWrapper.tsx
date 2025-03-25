import { auth } from '@/auth';

// Lấy URL gốc từ biến môi trường (API_URL)
const baseUrl = process.env.API_URL;

// Hàm thực hiện HTTP GET request
async function get(url: string) {
    const requestOptions = {
        method: 'GET',
        headers: await getHeaders() // Lấy headers (bao gồm token nếu có)
    };

    const response = await fetch(baseUrl + url, requestOptions);

    return handleResponse(response); // Xử lý phản hồi từ server
}

// Hàm thực hiện HTTP POST request
async function post(url: string, body: {}) {
    const requestOptions = {
        method: 'POST',
        headers: await getHeaders(),
        body: JSON.stringify(body) // Chuyển body thành JSON
    };

    const response = await fetch(baseUrl + url, requestOptions);

    return handleResponse(response);
}

// Hàm thực hiện HTTP PUT request
async function put(url: string, body: {}) {
    const requestOptions = {
        method: 'PUT',
        headers: await getHeaders(),
        body: JSON.stringify(body)
    };

    const response = await fetch(baseUrl + url, requestOptions);

    return handleResponse(response);
}

// Hàm thực hiện HTTP DELETE request
async function del(url: string) {
    const requestOptions = {
        method: 'DELETE',
        headers: await getHeaders()
    };

    const response = await fetch(baseUrl + url, requestOptions);

    return handleResponse(response);
}

// Hàm tạo headers cho các request
async function getHeaders() {
    const session = await auth(); // Lấy session hiện tại (gồm accessToken)
    const headers = {
        'Content-type': 'application/json' // Đặt kiểu dữ liệu là JSON
    } as any;
    if (session?.accessToken) { // Nếu có accessToken, thêm vào headers
        headers.Authorization = 'Bearer ' + session.accessToken;
    }
    return headers;
}

// Hàm xử lý phản hồi từ server
async function handleResponse(response: Response) {
    const text = await response.text(); // Đọc dữ liệu phản hồi dạng text
    let data;
    try {
        data = JSON.parse(text); // Thử chuyển text thành JSON
    } catch (error) {
        data = text; // Nếu không phải JSON, giữ nguyên text
    }

    if (response.ok) { // Nếu phản hồi HTTP status 200-299
        return data || response.statusText; // Trả về dữ liệu hoặc trạng thái
    } else { // Nếu phản hồi lỗi
        const error = {
            status: response.status,
            message: typeof data === 'string' ? data : response.statusText // Thông báo lỗi
        };
        return { error }; // Trả về đối tượng lỗi
    }
}

// Gói các hàm lại trong fetchWrapper để dùng chung
export const fetchWrapper = {
    get,
    post,
    put,
    del
};