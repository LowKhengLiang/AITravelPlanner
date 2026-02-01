'use client';

import { CommunityPost } from '@/types';
import { Heart, Star, Download, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useCommunityStore } from '@/lib/communityStore';

interface ItineraryCardProps {
    post: CommunityPost;
}

export default function ItineraryCard({ post }: ItineraryCardProps) {
    const { toggleLike, importItinerary } = useCommunityStore();

    return (
        <div className="group relative rounded-xl overflow-hidden glass hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1">
            {/* Cover Image */}
            <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
                <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Stats Overlay */}
                <div className="absolute bottom-3 left-3 right-3 z-20 flex justify-between items-end">
                    <div className="flex items-center gap-2 text-xs text-white/80">
                        <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-pink-400" /> {post.stats.likes}
                        </span>
                        <span className="flex items-center gap-1">
                            <Download className="w-3 h-3 text-blue-400" /> {post.stats.imports}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-yellow-400 font-bold border border-white/10">
                        <Star className="w-3 h-3 fill-yellow-400" /> {post.stats.rating.toFixed(1)}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <Link href={`/community/post/${post.id}`} className="block">
                    <h3 className="text-lg font-bold text-white hover:text-primary-400 transition-colors line-clamp-2">
                        {post.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs overflow-hidden border border-white/10">
                            {post.author.avatar.startsWith('http') ? (
                                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                            ) : (
                                post.author.avatar
                            )}
                        </div>
                        <span className="text-xs text-gray-400 truncate max-w-[100px]">{post.author.name}</span>
                    </div>

                    <div className="flex gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
