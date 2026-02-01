'use client';

import { useTripStore } from '@/lib/store';
import { useCommunityStore } from '@/lib/communityStore';
import { ArrowLeft, Send, Image as ImageIcon, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DraggableActivityCard from '@/components/DraggableActivityCard';

export default function CreatePostPage() {
    const { dailyItineraries, selectedCountry, numberOfDays } = useTripStore();
    const { publishPost } = useCommunityStore();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        if (!title || !content) return;
        setIsPublishing(true);

        // Simulate snapshot of current trip state
        const tripSnapshot = {
            // Deep copy store state simulation
            selectedCountry,
            selectedRegion: null,
            numberOfDays,
            dailyItineraries,
            currentDay: 1,
            startDate: null,
            totalBudget: 0,
            currency: 'USD',
            selectedDestinations: [],
            optimizedRoute: []
        };

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1000));

        publishPost({
            title,
            content,
            coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-1.2.1&auto=format&fit=crop&w=1933&q=80', // Mock random image
            itinerarySnapshot: tripSnapshot,
            tags: [selectedCountry?.name || 'Travel', 'Adventure']
        });

        router.push('/community');
    };

    const handleInsertActivity = (activityName: string) => {
        setContent(prev => prev + `\n\n**${activityName}** was amazing! We spent time exploring...`);
    };

    // Flatten activities for the sidebar
    const plannedActivities = dailyItineraries.flatMap(day =>
        day.timeSlots.filter(s => s.activity).map(s => s.activity!)
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <header className="sticky top-0 z-50 glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        Cancel
                    </Link>
                    <h1 className="text-lg font-bold">New Travel Guide</h1>
                    <button
                        onClick={handlePublish}
                        disabled={!title || !content || isPublishing}
                        className="px-6 py-2 rounded-full bg-primary-500 font-bold hover:bg-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isPublishing ? 'Publishing...' : <><Send className="w-4 h-4" /> Publish</>}
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Editor */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Title Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Give your trip a catchy title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-4xl font-black placeholder-gray-600 focus:outline-none"
                        />
                    </div>

                    {/* Cover Image Placeholder */}
                    <div className="h-64 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:border-primary-500/50 hover:text-primary-400 transition-all cursor-pointer bg-white/5">
                        <ImageIcon className="w-10 h-10 mb-2" />
                        <span className="font-medium">Add a cover photo</span>
                    </div>

                    {/* Content Editor */}
                    <div className="relative">
                        <div className="absolute top-[-30px] right-0 text-xs text-gray-500">
                            Tip: Click activities on the right to add them
                        </div>
                        <textarea
                            placeholder="Tell your story... (Markdown supported)"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-[600px] bg-transparent resize-none text-lg text-gray-300 placeholder-gray-600 focus:outline-none leading-relaxed p-4 rounded-xl border border-white/5 focus:border-white/10"
                        />
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="sticky top-24">
                        <div className="glass p-6 rounded-2xl border border-white/10">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-400" />
                                Your Itinerary
                            </h3>
                            <div className="text-sm text-gray-400 mb-6">
                                Click an activity to insert it into your story.
                            </div>

                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {plannedActivities.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 italic">
                                        No activities planned yet. Go back to the planner to add some!
                                    </div>
                                ) : (
                                    plannedActivities.map((activity, idx) => (
                                        <DraggableActivityCard
                                            key={`${activity.id}-${idx}`}
                                            activity={activity}
                                            onClick={() => handleInsertActivity(activity.name)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
