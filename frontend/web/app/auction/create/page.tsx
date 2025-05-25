'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  'Game Account',
  'Movie Account',
  'Other'
];

const CreateAuctionPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    des: '',
    category: categories[0],
    reservePrice: '',
    price: '',
    endAt: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name || !form.reservePrice || !form.price || !form.endAt) {
      setError('Name, reserve price, price, and end time are required.');
      return;
    }

    const now = new Date().toISOString();
    const auctionDto = {
        reservePrice: Number(form.reservePrice),
        sellerID: null,
        winnerID: null,
        currentHighBid: 0,
        createdAt: now,
        updatedAt: now,
        endAt: form.endAt,
        status: "Live",
        name: form.name,
        des: form.des,
        category: form.category,
        price: Number(form.price),
        itemcreatedAt: now,
        modifiedAt: now,
    };

    setLoading(true);
    try {
      const res = await fetch('http://localhost:7004/api/auctions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auctionDto),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || 'Failed to create auction');
      } else {
        setSuccess('Auction created successfully!');
        setTimeout(() => {
          router.push('/auction');
        }, 1000);
      }
    } catch (err) {
      setError('Failed to create auction');
    }
    setLoading(false);
  };

  // Add 'border border-gray-400' to all inputs, textarea, and select
  const inputClass =
    'mt-1 block w-full rounded border border-gray-400 border-solid focus:border-blue-500 focus:ring-blue-500';

  return (
    <main className="p-8 max-w-xl mx-auto">
      <button
        className="mb-4 text-blue-500 hover:underline"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-4">Create Auction</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block font-semibold text-gray-700">
          Name *
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </label>
        <label className="block font-semibold text-gray-700">
          Description
          <textarea
            name="des"
            value={form.des}
            onChange={handleChange}
            rows={3}
            className={inputClass}
          />
        </label>
        <label className="block font-semibold text-gray-700">
          Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            {categories.map((cat) => (
              <option value={cat} key={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label className="block font-semibold text-gray-700">
          Reserve Price ($) *
          <input
            type="number"
            name="reservePrice"
            min="0"
            step="0.01"
            value={form.reservePrice}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </label>
        <label className="block font-semibold text-gray-700">
          Starting Price ($) *
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </label>
        <label className="block font-semibold text-gray-700">
          End Time *
          <input
            type="datetime-local"
            name="endAt"
            value={form.endAt}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          className={`w-full py-2 rounded font-semibold ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Auction'}
        </button>
      </form>
    </main>
  );
};

export default CreateAuctionPage;