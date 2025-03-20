'use client'
import { useState } from "react";
import OrderCard from "./OrderCard";
import { Order, PageFormat } from ".";
import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function List() {
    const [data, setData] = useState<PageFormat<Order>>();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 p-6 grid grid-cols-3 gap-4">
                <OrderCard order={{
                    Id: "",
                    TotalPrice: 0,
                    Buyer: undefined,
                    Seller: undefined,
                    CreatedAt: "",
                    Status: "",
                    SoldAmount: "",
                    Name: "Hello world",
                    Description: "",
                    Price: 50000,
                    Category: "",
                    ImageUrl: "data:image/jpeg;base64,...",
                    StockQuantity: ""
                }} />
            </div>
            <Footer />
        </div>
    );
}
