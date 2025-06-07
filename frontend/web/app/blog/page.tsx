import React from 'react';
import Image from 'next/image';

type Article = {
    title: string;
    link: string;
    pubDate: string;
    thumbnail?: string;
};

type RSSItem = {
    title: string;
    link: string;
    pubDate: string;
    thumbnail?: string;
};

async function getIGNNews(): Promise<Article[]> {
    try {
        const RSS_URL = encodeURIComponent('https://feeds.ign.com/ign/all');
        const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}`;

        const res = await fetch(API_URL, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error(`Failed to fetch news: ${res.status}`);
        }

        const data = await res.json();

        const articles = (data.items as RSSItem[]).slice(0, 6).map((item) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            thumbnail: item.thumbnail,
        }));

        return articles;
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu RSS:', err);
        return [];
    }
}

export default async function BlogPage() {
    const articles = await getIGNNews();

    return (
        <main className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Tin tức game mới nhất</h1>
            <ul className="space-y-6">
                {articles.length === 0 && <p>Không có tin tức để hiển thị.</p>}
                {articles.map((article, index) => (
                    <li key={index} className="border-b pb-4 flex gap-4">
                        {article.thumbnail && (
                            <div className="relative w-32 h-20 flex-shrink-0">
                                <Image
                                    src={article.thumbnail}
                                    alt={article.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded"
                                />
                            </div>
                        )}
                        <div>
                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xl font-semibold text-blue-600 hover:underline"
                            >
                                {article.title}
                            </a>
                            <p className="text-gray-500 text-sm mt-1">
                                {new Date(article.pubDate).toLocaleString()}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </main>
    );
}
