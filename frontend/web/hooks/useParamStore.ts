import { create } from "zustand";

type State = {
    pageNumber: number; // Thứ tự của trang hiện tại
    pageSize: number; // Số lượng item trong 1 trang
    pageCount: number; // Tổng số trang
    searchTerm: string; // Từ khóa tìm kiếm (ví dụ: createAt, name)
    searchValue: string; // Giá trị mà người dùng nhập
    orderBy: string; // Sắp xếp theo trường nào
    winner?: string;
    filterBy: string;
    Seller?: string; // Người bán
    Buyer?: string; // Người mua
    minPrice?: number | null;
    maxPrice?: number | null;
};

type Actions = {
    setParams: (params: Partial<State>) => void; // Hàm cập nhật tham số của State
    reset: () => void; // Reset state về mặc định
    setSearchValue: (value: string) => void; // Cập nhật giá trị tìm kiếm
};

// Giá trị khởi tạo
const initialState: State = {
    pageNumber: 1,
    pageSize: 12,
    pageCount: 1,
    filterBy: "",
    searchTerm: "",
    searchValue: "",
    orderBy: "new",
    Seller: undefined,
    Buyer: undefined,
    minPrice: null,
    maxPrice: null,
};

// Dùng Zustand để quản lý state
export const useParamStore = create<State & Actions>((set) => ({
    ...initialState, // Giá trị ban đầu cho state

    setParams: (newParams: Partial<State>) => {
        set((state) => { // set được cung cấp bởi Zustand để cập nhật state
            // Nếu có pageNumber mới, cập nhật nó
            if (newParams.pageNumber) {
                return { ...state, pageNumber: newParams.pageNumber }
            } else { // Nếu không có pageNumber, reset pageNumber về 1
                return { ...state, ...newParams, pageNumber: 1 }
            }
        })
    },

    setSearchValue: (value: string) => {
        set((state) => ({ ...state, searchValue: value }));
    },

    reset: () => set(initialState), // Reset về trạng thái ban đầu
}));
