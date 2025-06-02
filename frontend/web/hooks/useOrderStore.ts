import { create } from "zustand"
import { Order, PageResult } from ".."

type State = {
    orders: Order[];
    totalCount: number; // Tổng số đơn hàng
    pageCount: number; // Tổng số trang
};

type Actions = {
    setData: (data: PageResult<Order>) => void; // Cập nhật dữ liệu phân trang
    setCurrentPrice: (orderId: string, amount: number) => void; // Cập nhật giá đơn hàng
};

// Khởi tạo trạng thái ban đầu
const initialState: State = {
    orders: [],
    pageCount: 0,
    totalCount: 0,
};

// Tạo store Zustand
export const useOrderStore = create<State & Actions>((set) => ({
    ...initialState,
    setData: (data: PageResult<Order>) => {
        console.log("Setting store data (orders):", data.results.map(d => ({ id: d.id, Price: d.Price })));
        set({
            orders: data.results,
            totalCount: data.totalCount,
            pageCount: data.pageCount,
        });
    },

    setCurrentPrice: (orderId: string, amount: number) => {
        set((state) => ({
            orders: state.orders.map((order) =>
                order.id === orderId ? { ...order, Price: amount } : order
            ),
        }));
    },
}));