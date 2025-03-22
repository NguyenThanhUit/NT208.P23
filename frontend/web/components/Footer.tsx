
export default function Footer() {
    return (
        <footer className="bg-white py-8 border-t w-full">
            <div className="max-w-7xl mx-auto flex justify-between items-start px-5">
                {/* Duong dan den fb, ins, x */}
                <div className="space-y-4">
                    <div className="text-2xl font-bold"></div>
                    <div className="flex space-x-3">
                        <a href="#" className="text-gray-600 hover:text-black">
                            <i className="fab fa-x"></i>
                        </a>
                        <a href="#" className="text-gray-600 hover:text-black">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-gray-600 hover:text-black">
                            <i className="fab fa-youtube"></i>
                        </a>
                        <a href="#" className="text-gray-600 hover:text-black">
                            <i className="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>


                <div className="flex space-x-10 ">
                    <div>
                        <h4 className="font-semibold mb-2 text-black">GIỚI THIỆU</h4>
                        <ul className="text-gray-600 space-y-1">
                            <li><a href="#">Game bản quyền là gì</a></li>
                            <li><a href="#">Giới thiệu e-shop</a></li>
                            <li><a href="#">Điều khoản dịch vụ</a></li>
                            <li><a href="#">Chính sách bảo mật</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-black"> TÀI KHOẢN</h4>
                        <ul className="text-gray-600 space-y-1">
                            <li><a href="#">Đăng nhập</a></li>
                            <li><a href="#">Đăng kí</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-black">Liên hệ</h4>
                        <ul className="text-gray-600 space-y-1">
                            <li><a href="#">Support</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
