'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface AuctionItem {
  id: string;
  sellerID: string;
  name: string;
  des: string;
  category: string;
  price: number;
  createdAt: string;
  endAt: string;
  currentHighBid: number;
}

const BidPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [auction, setAuction] = useState<AuctionItem | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('Loading...');

  const isValidDate = (date: Date) => !isNaN(date.getTime());

  useEffect(() => {
    if (!id) {
      setError('No auction ID provided');
      setLoading(false);
      return;
    }

    const fetchAuction = async () => {
      try {
        const res = await fetch(`http://localhost:7004/api/auctions/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch auction');
        const data = await res.json();
        setAuction(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [id]);

  useEffect(() => {
    if (!auction) return;

    const updateTimer = () => {
      const now = new Date();
      const end = new Date(auction.endAt);
      if (!isValidDate(end)) {
        setTimeLeft('Invalid end time');
        return;
      }

      const diff = end.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft('Auction ended');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
        );
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  if (loading) return <div className="p-8">Loading auction...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!auction) return <div className="p-8 text-red-500">Auction not found.</div>;

  const isAuctionEnded = timeLeft === 'Auction ended';

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const numericBid = parseFloat(bidAmount);

    if (Number.isNaN(numericBid) || numericBid <= auction.currentHighBid) {
      setError(`Your bid must be greater than the current high bid ($${auction.currentHighBid}).`);
      return;
    }
    
    try {

      setSuccess('Bid placed successfully!');
      setBidAmount('');
      // Optionally refresh auction data to show new high bid
      setAuction({ ...auction, currentHighBid: numericBid });
    } catch (err) {
      setError('Failed to place bid. Please try again.');
    }
  };

  let createdAtString = 'Invalid Date';
  if (auction.createdAt) {
    const createdAtDate = new Date(auction.createdAt);
    if (!isNaN(createdAtDate.getTime())) {
      createdAtString = createdAtDate.toLocaleString();
    }
  }

  return (
    <main className="p-8 max-w-lg mx-auto">
      <button
        className="mb-4 text-blue-500 hover:underline"
        onClick={() => router.back()}
      >
        ← Back
      </button>
      <div className="border rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{auction.name}</h1>
        <p className="text-gray-700 mb-2">{auction.des || <span className="italic text-gray-400">No description</span>}</p>
        <div className="mb-2">
          <span className="block text-gray-500">Category: {auction.category}</span>
          <span className="block">Seller: <span className="font-mono">{auction.sellerID}</span></span>
          <span className="block">Created at: {createdAtString}</span>
        </div>
        <div className="mb-2">
          <span className="block font-bold">Starting Price: ${auction.price}</span>
          <span className="block text-purple-700 font-bold">
            Current High Bid: ${auction.currentHighBid}
          </span>
        </div>
        <div className={`mb-2 text-sm font-medium ${isAuctionEnded ? 'text-red-600' : 'text-green-600'}`}>
          {isAuctionEnded ? 'Auction ended' : `Time left: ${timeLeft}`}
        </div>
      </div>
      <form onSubmit={handleBid} className="space-y-4">
        <label className="block font-semibold text-gray-700">
          Your Bid
          <input
            type="number"
            step="0.01"
            min={auction.currentHighBid + 0.01}
            value={bidAmount}
            onChange={e => setBidAmount(e.target.value)}
            disabled={isAuctionEnded}
            className="mt-1 block w-full rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            placeholder={`Greater than $${auction.currentHighBid}`}
            required
          />
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <button
          type="submit"
          disabled={isAuctionEnded}
          className={`w-full py-2 rounded font-semibold ${
            isAuctionEnded
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Place Bid
        </button>
      </form>
    </main>
  );
};

export default BidPage;