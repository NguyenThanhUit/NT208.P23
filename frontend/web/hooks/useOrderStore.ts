import { create } from "zustand"
import { Order, PageResult } from ".."

type State = {
    orders: Order[];
    totalCount: number;
    pageCount: number;
};

type Actions = {
    setData: (data: PageResult<Order>) => void;
    setCurrentPrice: (orderId: string, amount: number) => void;
};


const initialState: State = {
    orders: [],
    pageCount: 0,
    totalCount: 0,
};


export const useOrderStore = create<State & Actions>((set) => ({
    ...initialState,
    setData: (data: PageResult<Order>) => {
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