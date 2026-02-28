'use client';

import { useCommunityStore } from '@/lib/communityStore';
import { useTripStore } from '@/lib/store';
import { ArrowLeft, CalendarCheck, Heart, User, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import ItineraryPreview from '@/components/ItineraryPreview';

export default function PostPage() {
    const params = useParams();
    const router = useRouter();
    const { getPost, toggleLike, importItinerary } = useCommunityStore();
    const { loadTrip } = useTripStore();

    // In a real app we'd fetch async, but here we use store
    const post = getPost(params.id as string);
    const [isImporting, setIsImporting] = useState(false);

    if (!post) return <div className="text-white p-8">Post not found</div>;

    const handleImport = async () => {
        if (confirm("This will overwrite your current planner's itinerary. Continue?")) {
            setIsImporting(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            // Deep copy to avoid mutating store state directly
            const importedSnapshot = JSON.parse(JSON.stringify(post.itinerarySnapshot));

            // Smart Date Import Logic
            const userStartDateStr = useTripStore.getState().startDate;
            const postStartDateStr = importedSnapshot.startDate;

            if (userStartDateStr && postStartDateStr) {
                // Use UTC to prevent local timezone offsets from messing up the day gap calculation
                const userDate = new Date(`${userStartDateStr}T00:00:00Z`);
                const postDate = new Date(`${postStartDateStr}T00:00:00Z`);

                // Calculate difference in milliseconds
                const diffTime = userDate.getTime() - postDate.getTime();
                const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

                // Offset all daily itineraries
                importedSnapshot.dailyItineraries.forEach((day: any) => {
                    if (day.date) {
                        const originalDayDate = new Date(`${day.date}T00:00:00Z`);
                        originalDayDate.setUTCDate(originalDayDate.getUTCDate() + diffDays);
                        // Format back to YYYY-MM-DD safely
                        day.date = originalDayDate.toISOString().split('T')[0];
                    }
                });

                // Update start date of snapshot to match user's
                importedSnapshot.startDate = userStartDateStr;
            } else if (!userStartDateStr && postStartDateStr) {
                // If user hasn't set a start date, inherit the post's start date
                useTripStore.getState().setStartDate(postStartDateStr);
            }

            // Robust Hydration
            loadTrip(importedSnapshot);

            // Trigger import logic in community store (stats)
            importItinerary(post.id);

            // Redirect
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 pb-20">
            {/* Header */}
            <div className="relative h-[400px]">
                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                <div className="absolute top-4 left-4 z-20">
                    <Link href="/community" className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        {post.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30 text-sm font-medium backdrop-blur-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-5xl font-black text-white mb-6 leading-tight">{post.title}</h1>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-lg">
                                {post.author.avatar}
                            </div>
                            <div>
                                <div className="font-bold text-white mb-0.5">{post.author.name}</div>
                                <div className="text-gray-400 text-sm">Published on {new Date(post.createdAt).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toggleLike(post.id)}
                                className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 flex items-center gap-2 transition-all font-medium"
                            >
                                <Heart className={`w-5 h-5 ${post.stats.likes > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
                                {post.stats.likes} Likes
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={isImporting}
                                className="px-6 py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
                            >
                                {isImporting ? 'Importing...' : <><CalendarCheck className="w-5 h-5" /> Import Itinerary</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-12">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {/* Simple markdown rendering for demo */}
                        {post.content.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mb-4">{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mb-4 mt-8 text-primary-400">{line.replace('## ', '')}</h2>;
                            if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc mb-2 text-gray-300">{line.replace('- ', '')}</li>;
                            return <p key={i} className="text-gray-300 leading-relaxed mb-4">{line}</p>;
                        })}
                    </div>

                    {/* Itinerary Preview */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-gray-400 font-medium uppercase tracking-wider text-sm">Detailed Itinerary</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>
                        <ItineraryPreview trip={post.itinerarySnapshot} />
                    </div>
                </div>

                {/* Sidebar / Snapshot Info */}
                <div className="lg:col-span-4 space-y-6 max-w-sm ml-auto">
                    <div className="sticky top-24 space-y-6">
                        <div className="glass p-6 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-purple-400" />
                                <h3 className="font-bold text-white">Trip Summary</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <span className="text-gray-400">Duration</span>
                                    <span className="text-white font-medium">{post.itinerarySnapshot.numberOfDays} Days</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <span className="text-gray-400">Budget Style</span>
                                    <span className="text-white font-medium">{post.tags.includes('Budget') ? '$ Cheap' : '$$$ Luxury'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Author Rating</span>
                                    <span className="text-yellow-400 font-medium flex items-center gap-1">
                                        4.8 <Star className="w-3 h-3 fill-yellow-400" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="glass p-6 rounded-2xl border border-white/10">
                            <h3 className="font-bold text-white mb-2">Author</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-lg">
                                    {post.author.avatar}
                                </div>
                                <div>
                                    <div className="font-bold">{post.author.name}</div>
                                    <div className="text-xs text-primary-400 font-medium">{post.author.followers} Followers</div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-400 mb-4">{post.author.bio || 'Passionate traveler sharing experiences.'}</div>
                            <button className="w-full py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-all">
                                Follow User
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Star(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
}
