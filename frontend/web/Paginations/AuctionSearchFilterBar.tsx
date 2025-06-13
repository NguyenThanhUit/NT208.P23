import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useParamStore } from "@/hooks/useParamStore";
import { Button, ButtonGroup, Dropdown } from "flowbite-react";

export default function AuctionSearchFilterBar() {
    const setParams = useParamStore((state) => state.setParams);
    const searchValue = useParamStore((state) => state.searchValue);
    const setSearchValue = useParamStore((state) => state.setSearchValue);
    const pageSize = useParamStore((state) => state.pageSize);
    const orderBy = useParamStore((state) => state.orderBy);
    const filterBy = useParamStore((state) => state.filterBy);

    const orderOptions = [
        { label: "Bảng chữ cái", value: "name" },
        { label: "Mới", value: "new" },
    ];

    const filterOptions = [
        { label: "Đã hoàn thành", value: "finished" },
        { label: "Sắp kết thúc", value: "endingSoon" },
    ];

    const pageSizeButtons = [12, 16, 20];

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        setSearchValue(value);
        setParams({ searchTerm: value });
    }

    const selectedOrderLabel =
        orderOptions.find((opt) => opt.value === orderBy)?.label || "Mới";
    const selectedFilterLabel =
        filterOptions.find((opt) => opt.value === filterBy)?.label || "Tất cả";

    return (
        <div className="flex flex-col lg:flex-row flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-md shadow-sm border">


            {/* Filter & Order */}
            <div className="flex flex-wrap gap-4 items-center">
                {/* FilterBy Dropdown */}
                <Dropdown
                    label={
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">🎮 Thể loại:</span>
                            <span className="text-sm text-black">{selectedFilterLabel}</span>
                        </div>
                    }
                    color="gray"
                    dismissOnClick={true}
                >
                    {filterOptions.map(({ label, value }) => (
                        <Dropdown.Item
                            key={value}
                            onClick={() => setParams({ filterBy: value })}
                            className={`${filterBy === value ? "text-red-600 font-semibold" : ""
                                }`}
                        >
                            {label}
                        </Dropdown.Item>
                    ))}
                    <Dropdown.Item
                        onClick={() => setParams({ filterBy: "" })}
                        className={`${!filterBy ? "text-red-600 font-semibold" : ""}`}
                    >
                        Tất cả
                    </Dropdown.Item>
                </Dropdown>

                {/* Order By Dropdown */}
                <Dropdown
                    label={
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">🔽 Sắp xếp:</span>
                            <span className="text-sm text-black">{selectedOrderLabel}</span>
                        </div>
                    }
                    color="gray"
                    dismissOnClick={true}
                >
                    {orderOptions.map(({ label, value }) => (
                        <Dropdown.Item
                            key={value}
                            onClick={() => setParams({ orderBy: value })}
                            className={`${orderBy === value ? "text-red-600 font-semibold" : ""
                                }`}
                        >
                            {label}
                        </Dropdown.Item>
                    ))}
                </Dropdown>
            </div>

            {/* Page Size Buttons */}
            <div className="flex items-center gap-2">
                <span className="uppercase text-sm text-gray-500">Số lượng / trang</span>
                <ButtonGroup>
                    {pageSizeButtons.map((value, i) => (
                        <Button
                            key={i}
                            onClick={() => setParams({ pageSize: value })}
                            color={pageSize === value ? "red" : "gray"}
                            className="focus:ring-0"
                        >
                            {value}
                        </Button>
                    ))}
                </ButtonGroup>
            </div>
        </div>
    );
}
