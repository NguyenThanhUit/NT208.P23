'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

const AuctionPage: React.FC = () => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timers, setTimers] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const isValidDate = (date: Date) => !isNaN(date.getTime());
  const now = new Date();

  const liveAuctions = auctions.filter(
    (auction) => {
      const end = new Date(auction.endAt);
      return isValidDate(end) && end > now;
    }
  );
  const finishedAuctions = auctions.filter(
    (auction) => {
      const end = new Date(auction.endAt);
      return !isValidDate(end) || end <= now;
    }
  );

  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      const newTimers: { [key: string]: string } = {};

      liveAuctions.forEach((auction) => {
        const end = new Date(auction.endAt);
        if (!isValidDate(end)) {
          newTimers[auction.id] = 'Invalid end time';
          return;
        }
        const diff = end.getTime() - now.getTime();

        if (diff <= 0) {
          newTimers[auction.id] = 'Auction ended';
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimers[auction.id] =
            `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
        }
      });

      setTimers(newTimers);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [auctions]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await fetch('http://localhost:7004/api/auctions', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch auctions');
        const data = await res.json();
        setAuctions(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  if (loading) return <div className="p-8">Loading auctions...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Auctions</h1>

      {/* Live Auctions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Live Auctions</h2>
        {liveAuctions.length === 0 ? (
          <div>No live auctions found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveAuctions.map((auction) => (
              <div
                key={auction.id}
                className="border rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/auction/${auction.id}`)}
                  title="View details"
                >
                  <h3 className="text-xl font-semibold mb-1 underline hover:text-blue-600">{auction.name}</h3>
                </div>
                <p className="text-gray-600 mb-2">{auction.des}</p>
                <div className="mb-2">
                  <span className="block text-gray-500">Category: {auction.category}</span>
                  <span className="block font-bold">Starting Price: ${auction.price}</span>
                  <span className="block text-purple-700 font-bold">
                    Current High Bid: ${auction.currentHighBid}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-sm text-blue-600 font-medium">Status: Live</span>
                </div>
                <div className="mb-4 text-sm text-green-600 font-medium">
                  Time left: {timers[auction.id] || 'Loading...'}
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded flex-1"
                    onClick={() => router.push(`/auction/${auction.id}/bid`)}
                  >
                    Bid
                  </button>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-blue-600 font-semibold py-2 rounded flex-1"
                    onClick={() => router.push(`/auction/${auction.id}`)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Finished Auctions */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Finished Auctions</h2>
        {finishedAuctions.length === 0 ? (
          <div>No finished auctions found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {finishedAuctions.map((auction) => (
              <div
                key={auction.id}
                className="border rounded-lg shadow p-4 flex flex-col justify-between bg-gray-100 opacity-80"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/auction/${auction.id}`)}
                  title="View details"
                >
                  <h3 className="text-xl font-semibold mb-1 underline hover:text-blue-600">{auction.name}</h3>
                </div>
                <p className="text-gray-600 mb-2">{auction.des}</p>
                <div className="mb-2">
                  <span className="block text-gray-500">Category: {auction.category}</span>
                  <span className="block font-bold">Starting Price: ${auction.price}</span>
                  <span className="block text-purple-700 font-bold">
                    Final High Bid: ${auction.currentHighBid}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-sm text-gray-500 font-medium">Status: Ended</span>
                </div>
                <div className="mb-4 text-sm text-red-600 font-medium">
                  Auction ended
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-gray-400 text-white font-semibold py-2 rounded flex-1 cursor-not-allowed"
                    disabled
                  >
                    Auction Closed
                  </button>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-blue-600 font-semibold py-2 rounded flex-1"
                    onClick={() => router.push(`/auction/${auction.id}`)}
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AuctionPage;