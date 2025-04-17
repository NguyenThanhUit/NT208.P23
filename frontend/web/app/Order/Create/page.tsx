import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import OrderForm from '@/components/OrderForm'
import React from 'react'

export default function Create() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-12 px-4">
                <OrderForm />
            </div>
            <Footer />
        </div>
    )
}
