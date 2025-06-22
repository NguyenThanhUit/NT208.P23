"use client";
import { useEffect, useState } from "react";
import qs from "query-string";

import ProductList from "./components/ProductList";
import SearchFilterBar from "./Paginations/SearchFilterBar";
import { useParamStore } from "./hooks/useParamStore";
import { useShallow } from "zustand/shallow";
import { getData, initUserMoneyWallet } from "./app/actions/orderactions";
import { useOrderStore } from "./hooks/useOrderStore";
import AppPagination from "./components/AppPagination";
import { getCurrentUser } from "./app/actions/authactions";
import { sendUserInformation } from "./app/actions/useraction";

export default function Homepage() {
    const [loading, setLoading] = useState(true);
    const [hasSent, setHasSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState(0);
    const [user, setUser] = useState<{ username: string, name: string } | null>(null);

    const { order, totalCount, pageCount } = useOrderStore(
        useShallow(state => ({
            order: state.orders,
            totalCount: state.totalCount,
            pageCount: state.pageCount
        }))
    );

    const params = useParamStore(useShallow(state => ({
        pageNumber: state.pageNumber,
        pageSize: state.pageSize,
        pageCount: state.pageCount,
        searchTerm: state.searchTerm,
        orderBy: state.orderBy,
        seller: state.Seller,
        filterBy: state.filterBy,
        buyer: state.Buyer,
        minPrice: state.minPrice,
        maxPrice: state.maxPrice,
    })));

    const setParams = useParamStore(state => state.setParams);
    const setData = useOrderStore(state => state.setData);

    const url = '?' + qs.stringify(params);

    useEffect(() => {
        const fetchUserAndInitWallet = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser?.username) {
                    setUser({
                        ...currentUser,
                        name: currentUser?.username || "",
                    });

                    if (!hasSent) {
                        await sendUserInformation({
                            email: currentUser.email,
                            name: currentUser.username,
                        });
                        setHasSent(true);
                    }

                    const initialBalance = 0;
                    const wallet = await initUserMoneyWallet(currentUser?.username, { balance: initialBalance });
                    setWalletBalance(wallet.balance);
                }
            } catch (error) {
                console.error("Không thể lấy thông tin người dùng hoặc ví:", error);
            }
        };

        fetchUserAndInitWallet();
    }, [hasSent]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getData(url).then(data => {
            setData(data);
            setLoading(false);
        }).catch(err => {
            setError('Lỗi khi tải dữ liệu');
            setLoading(false);
        });
    }, [url, setData]);

    function setPageNumber(pageNumber: number) {
        setParams({ pageNumber });
    }

    return (
        <div>
            <div className="bg-white">
                <SearchFilterBar />
            </div>
            <main className="bg-white w-full min-h-screen p-4 flex-col">
                {loading && <p className="min-h-screen text-center text-gray-500">Đang tải sản phẩm...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {order && order.length > 0 ? (
                    <ProductList orders={order} />
                ) : (
                    !loading && !error && <p className="min-h-screen text-center text-gray-500">Không có sản phẩm nào.</p>
                )}

                <div className='flex justify-center mt-4'>
                    <AppPagination
                        pageChanged={setPageNumber}
                        currentPage={params.pageNumber}
                        pageCount={pageCount}
                    />
                </div>
            </main>
        </div>
    );
}
