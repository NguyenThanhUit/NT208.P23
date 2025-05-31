// Import kiểu dữ liệu Auction (một phiên đấu giá) và PagedResult (kết quả phân trang)


// Import hàm create từ thư viện Zustand để tạo store
import { Auction, PageResult } from "@/index"
import { create } from "zustand"

// Kiểu dữ liệu cho trạng thái của store
type State = {
    auctions: Auction[]         // Mảng các phiên đấu giá
    totalCount: number          // Tổng số phiên (dùng cho phân trang)
    pageCount: number           // Tổng số trang (dùng cho phân trang)
}

// Kiểu dữ liệu cho các hàm thao tác với store
type Actions = {
    setData: (data: PageResult<Auction>) => void                   // Hàm để cập nhật dữ liệu phân trang
    setCurrentPrice: (auctionId: string, amount: number) => void    // Hàm để cập nhật giá hiện tại của một phiên
}

// Trạng thái ban đầu của store
const initialState: State = {
    auctions: [],     // Bắt đầu với mảng phiên đấu giá rỗng
    pageCount: 0,     // Chưa có trang nào
    totalCount: 0     // Chưa có phiên nào
}

// Tạo store Zustand
export const useAuctionStore = create<State & Actions>((set) => ({
    ...initialState,  // Gán trạng thái ban đầu

    // Hàm cập nhật dữ liệu phiên đấu giá từ server (thường gọi sau khi fetch API)
    setData: (data: PageResult<Auction>) => {
        set(() => ({
            auctions: data.results,         // Cập nhật danh sách phiên
            totalCount: data.totalCount,    // Cập nhật tổng số phiên
            pageCount: data.pageCount       // Cập nhật số trang
        }))
    },

    // Hàm cập nhật giá cao nhất hiện tại cho một phiên dựa vào ID phiên
    setCurrentPrice: (auctionId: string, amount: number) => {
        set((state) => ({
            // Duyệt qua các phiên, nếu phiên nào có ID trùng thì cập nhật giá
            auctions: state.auctions.map((auction) =>
                auction.id === auctionId
                    ? { ...auction, currentHighBid: amount }  // Cập nhật giá cao nhất mới
                    : auction                                  // Phiên khác thì giữ nguyên
            )
        }))
    }
}))
