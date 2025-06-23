'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/app/actions/authactions';
import {
    addSellerWaller,
    confirmOrder,
    getOrderUserHistory,
} from '@/app/actions/orderactions';
import {
    FaBoxOpen,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
} from 'react-icons/fa';

interface Item {
    productId: string;
    productName: string;
    quantity?: number;
    price?: number | string;
    seller: string;
}

interface Order {
    orderId: string;
    buyingStatus: number;
    walletDeposited?: boolean;
    items: Item[];
    totalAmount: number | string;
    paymentMethod: string;
    createdAt: string;
}

export default function OrderHistoryPage() {
    const router = useRouter();
    const [groupedOrders, setGroupedOrders] = useState<Record<string, Order[]>>({});
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [confirming, setConfirming] = useState<string | null>(null);
    const [timers, setTimers] = useState<Record<string, NodeJS.Timeout>>({});

    useEffect(() => {
        let refreshTimer: NodeJS.Timeout;

        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                if (!user || !user.name) {
                    setAuthError("⚠️ Bạn cần đăng nhập để xem lịch sử đơn hàng.");
                    setTimeout(() => router.push("/"), 3000);
                    setLoading(false);
                    return;
                }

                const orders = await getOrderUserHistory();
                const grouped = groupOrdersByDate(orders);
                setGroupedOrders(grouped);

                orders.forEach((order: Order) => {
                    if (order.buyingStatus === 0) {
                        order.items.forEach((item: Item) => {
                            const key = `${order.orderId}-${item.productId}`;
                            if (!timers[key]) {
                                const timeout = setTimeout(() => {
                                    handleConfirmItem(order.orderId, item.productId);
                                }, 60000); // 60 giây
                                setTimers(prev => ({ ...prev, [key]: timeout }));
                            }
                        });
                    }
                });

                const hasProcessingOrder = orders.some((o: Order) => o.buyingStatus === 0);
                if (hasProcessingOrder) {
                    refreshTimer = setTimeout(fetchData, 10000);
                }
            } catch (error) {
                console.error('❌ Lỗi khi lấy lịch sử đơn hàng:', error);
                setAuthError("❌ Có lỗi xảy ra khi lấy dữ liệu. Vui lòng thử lại sau.");
                setTimeout(() => router.push("/"), 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            if (refreshTimer) clearTimeout(refreshTimer);
            Object.values(timers).forEach(clearTimeout);
        };
    }, []);

    if (authError) {
        return (
            <div className="min-h-[60vh] flex flex-col justify-center items-center text-center text-red-600">
                <h2 className="text-2xl font-semibold mb-2">{authError}</h2>
                <p>Bạn sẽ được chuyển hướng về trang chủ sau ít giây...</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen p-6 text-center text-gray-600">
                Đang tải dữ liệu...
            </div>
        );
    }

    function groupOrdersByDate(orders: Order[]) {
        const grouped: Record<string, Order[]> = {};
        orders.forEach((order: Order) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(order);
        });
        return grouped;
    }

    function getStatusBadge(status: number) {
        switch (status) {
            case 0:
                return (
                    <span className="text-yellow-600 font-medium flex items-center gap-1">
                        <FaClock /> Chờ xác nhận
                    </span>
                );
            case 1:
                return (
                    <span className="text-red-600 font-medium flex items-center gap-1">
                        <FaTimesCircle /> Đã huỷ
                    </span>
                );
            case 3:
                return (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                        <FaCheckCircle /> Hoàn tất
                    </span>
                );
            default:
                return <span className="text-gray-500">Không xác định</span>;
        }
    }

    async function handleConfirmItem(orderId: string, productId: string) {
        if (confirming) return;
        try {
            setConfirming(productId);
            await confirmOrder(orderId, { itemID: productId });
            alert(`✅ Đã xác nhận sản phẩm ${productId}`);

            const orders = await getOrderUserHistory();
            setGroupedOrders(groupOrdersByDate(orders));

            const order = orders.find((o: Order) => o.orderId === orderId);
            if (!order) return;

            if (order.buyingStatus === 3 && !order.walletDeposited) {
                const item = order.items.find((i: Item) => i.productId === productId);
                if (!item) return;

                const sellerId = item.seller;
                const price = Number(item.price) || 0;
                const quantity = item.quantity ?? 1;
                const amount = quantity * price;

                await addSellerWaller(sellerId, { Amount: amount });

                alert(` Đã cộng ${amount.toLocaleString()} VNĐ vào ví người bán ${sellerId}`);
            }
        } catch (error) {
            console.error('❌ Lỗi xác nhận đơn hàng:', error);
            alert('Xác nhận thất bại. Vui lòng thử lại.');
        } finally {
            setConfirming(null);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen p-6 text-center text-gray-600">
                Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto h-[80vh] overflow-y-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-black">
                🧾 Lịch sử đơn hàng của bạn
            </h1>

            {Object.keys(groupedOrders).length === 0 ? (
                <p className="text-center text-gray-600">Không có đơn hàng nào được tìm thấy.</p>
            ) : (
                Object.entries(groupedOrders).map(([date, orders]) => (
                    <div key={date} className="mb-8">
                        <h2 className="text-xl font-semibold text-blue-700 mb-3 border-b pb-1">{date}</h2>
                        <div className="grid gap-4">
                            {orders.map((order: Order) => {
                                const itemsBySeller: Record<string, Item[]> = {};
                                order.items.forEach((item: Item) => {
                                    if (!itemsBySeller[item.seller]) {
                                        itemsBySeller[item.seller] = [];
                                    }
                                    itemsBySeller[item.seller].push(item);
                                });

                                const totalQuantity = order.items.reduce(
                                    (sum: number, item: Item) => sum + (item.quantity ?? 1),
                                    0
                                );

                                return (
                                    <div
                                        key={order.orderId}
                                        className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 transition hover:shadow-md"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold text-black flex items-center gap-2">
                                                <FaBoxOpen className="text-blue-600" />
                                                Đơn hàng #{order.orderId}
                                            </h3>
                                            <div>{getStatusBadge(order.buyingStatus)}</div>
                                        </div>

                                        <div className="text-sm text-gray-700 mb-3">
                                            <strong>💰 Tổng tiền:</strong>{' '}
                                            {Number(order.totalAmount).toLocaleString()} VNĐ
                                        </div>

                                        <div className="mb-3">
                                            {Object.entries(itemsBySeller).map(([seller, items]) => (
                                                <div
                                                    key={seller}
                                                    className="mb-4 border p-3 rounded-md bg-gray-50"
                                                >
                                                    <p className="font-semibold text-blue-700 mb-2">
                                                        🏪 Người bán: {seller}
                                                    </p>
                                                    <ul className="list-disc list-inside ml-4 text-gray-700 mb-2">
                                                        {items.map((item: Item, index: number) => (
                                                            <li key={index}>
                                                                {item.productName}{' '}
                                                                {item.productId && (
                                                                    <span className="text-gray-500 ml-2">
                                                                        ({item.productId})
                                                                    </span>
                                                                )}{' '}
                                                                – Số lượng: {item.quantity ?? 1}
                                                                {order.buyingStatus === 0 && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleConfirmItem(order.orderId, item.productId)
                                                                        }
                                                                        className="ml-2 text-sm text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700 transition"
                                                                        disabled={confirming === item.productId}
                                                                    >
                                                                        {confirming === item.productId
                                                                            ? 'Đang xác nhận...'
                                                                            : 'Xác nhận'}
                                                                    </button>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {order.buyingStatus === 3 && (
                                                        <button
                                                            onClick={() => router.push(`/review/${seller}`)}
                                                            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                                        >
                                                            Đánh giá người bán
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <p>
                                            <strong>🧾 Số lượng sản phẩm tổng:</strong> {totalQuantity} món
                                        </p>
                                        <p>
                                            <strong>💳 Phương thức thanh toán:</strong> {order.paymentMethod}
                                        </p>
                                        <p>
                                            <strong>🕒 Thời gian mua:</strong>{' '}
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
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
