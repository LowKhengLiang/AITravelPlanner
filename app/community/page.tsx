'use client';

import { useCommunityStore } from '@/lib/communityStore';
import ItineraryCard from '@/components/ItineraryCard';
import { Search, Flame, Clock, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CommunityPage() {
    const { posts } = useCommunityStore();
    const [filter, setFilter] = useState('trending'); // trending, new, top
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = posts.filter(post => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            post.title.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query)) ||
            post.itinerarySnapshot.selectedCountry?.name.toLowerCase().includes(query) ||
            post.itinerarySnapshot.selectedRegion?.name.toLowerCase().includes(query)
        );
    }).sort((a, b) => {
        if (filter === 'trending') return b.stats.imports - a.stats.imports;
        if (filter === 'new') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (filter === 'top') return b.stats.likes - a.stats.likes;
        return 0;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors self-start md:self-auto">
                        <ArrowLeft className="w-5 h-5 shrink-0" />
                        <span className="font-medium">Back to Planner</span>
                    </Link>
                    <h1 className="text-xl font-display font-bold text-white flex items-center gap-2 text-center flex-wrap justify-center">
                        <span className="text-blue-400">Community</span> Explorations
                    </h1>
                    <div className="hidden md:block w-32"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Hero Section */}
                <div className="relative rounded-2xl overflow-hidden h-[300px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=2021&q=80')] bg-cover bg-center opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />

                    <div className="relative z-10 text-center max-w-2xl px-4">
                        <h2 className="text-4xl font-bold text-white mb-4">Discover Your Next Adventure</h2>
                        <p className="text-gray-300 text-lg mb-8">Browse thousands of itineraries curated by travelers for travelers.</p>

                        <div className="relative max-w-md mx-auto">
                            <input
                                type="text"
                                placeholder="Search by country, city, or style..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full py-3 px-5 pr-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:border-primary-500 transition-all"
                            />
                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilter('trending')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${filter === 'trending' ? 'bg-orange-500/20 border-orange-500/50 text-orange-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                        <Flame className="w-4 h-4" /> Trending
                    </button>
                    <button
                        onClick={() => setFilter('new')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${filter === 'new' ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                        <Clock className="w-4 h-4" /> Newest
                    </button>
                    <button
                        onClick={() => setFilter('top')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${filter === 'top' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
                    >
                        <Star className="w-4 h-4" /> Top Rated
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <ItineraryCard key={post.id} post={post} />
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-20 text-gray-500">
                            No itineraries found matching your search.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
