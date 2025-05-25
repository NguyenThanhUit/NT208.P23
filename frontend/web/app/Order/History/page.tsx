'use client';

import React, { useEffect, useState } from 'react';
import { getOrderHistory } from '@/app/actions/orderactions';
import { getCurrentUser } from '@/app/actions/authactions';
import { FaBoxOpen, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

export default function OrderHistoryPage() {
    const [groupedOrders, setGroupedOrders] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();

                if (!user || !user.name) {
                    console.warn('Bạn chưa đăng nhập hoặc không có thông tin người dùng.');
                    setLoading(false);
                    return;
                }

                const orders = await getOrderHistory(user.name);
                const grouped = groupOrdersByDate(orders);
                setGroupedOrders(grouped);
            } catch (error) {
                console.error('Lỗi khi lấy lịch sử đơn hàng:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    function groupOrdersByDate(orders: any[]) {
        const grouped: Record<string, any[]> = {};
        orders.forEach((order) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(order);
        });
        return grouped;
    }

    function getStatusBadge(status: number) {
        switch (status) {
            case 0:
                return <span className="text-yellow-600 font-medium flex items-center gap-1"><FaClock /> Đang xử lý</span>;
            case 1:
                return <span className="text-green-600 font-medium flex items-center gap-1"><FaCheckCircle /> Hoàn tất</span>;
            case 2:
                return <span className="text-red-600 font-medium flex items-center gap-1"><FaTimesCircle /> Đã huỷ</span>;
            default:
                return <span className="text-gray-500">Không xác định</span>;
        }
    }

    if (loading) {
        return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="p-6 max-w-5xl mx-auto h-[80vh] overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">🧾 Lịch sử đơn hàng của bạn</h1>

            {Object.keys(groupedOrders).length === 0 ? (
                <p className="text-center text-gray-600">Không có đơn hàng nào được tìm thấy.</p>
            ) : (
                Object.entries(groupedOrders).map(([date, orders]) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-xl font-semibold text-blue-700 mb-3 border-b pb-1">{date}</h2>

                        <div className="grid gap-4">
                            {orders.map((order: any) => {
                                const totalQuantity = order.items.reduce(
                                    (sum: number, item: any) => sum + (item.quantity || 1),
                                    0
                                );

                                return (
                                    <div key={order.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition hover:shadow-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-black flex items-center gap-2">
                                                <FaBoxOpen className="text-blue-600" />
                                                Đơn hàng #{order.id}
                                            </h3>
                                            <div>{getStatusBadge(order.buyingStatus)}</div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
                                            <p><strong>👤 Người mua:</strong> {order.buyer}</p>
                                            <p><strong>💰 Tổng tiền:</strong> {Number(order.totalAmount).toLocaleString()} VNĐ</p>
                                            <p>
                                                <strong>📦 Sản phẩm:</strong>{" "}
                                                {order.items.map((item: any, index: number) => (
                                                    <span key={index}>
                                                        {item.productName}
                                                        {index < order.items.length - 1 ? ", " : ""}
                                                    </span>
                                                ))}
                                            </p>
                                            <p><strong>🧾 Số lượng sản phẩm:</strong> {totalQuantity} món</p>
                                            <p><strong>💳 Phương thức thanh toán:</strong> {order.paymentMethod}</p>
                                            <p><strong>🕒 Thời gian mua:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}