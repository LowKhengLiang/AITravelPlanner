'use client';

import { Activity } from '@/types';
import { MapPin, Clock, Star, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface ActivityCardProps {
    activity: Activity;
    isSelected?: boolean;
    onSelect: () => void;
}

const categoryEmoji: Record<string, string> = {
    hotel: '🏨',
    breakfast: '🍳',
    lunch: '🍜',
    dinner: '🍽️',
    cafe: '☕',
    temple: '⛩️',
    museum: '🏛️',
    park: '🌳',
    shopping: '🛍️',
    nightlife: '🌃',
    attraction: '🗼',
    culture: '🎭',
};

const priceSymbol = (level: number) => '💰'.repeat(level);

export default function ActivityCard({ activity, isSelected, onSelect }: ActivityCardProps) {
    return (
        <div
            className={`relative flex-shrink-0 w-72 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${isSelected
                ? 'ring-2 ring-primary-400 glass scale-105 shadow-2xl shadow-primary-500/30'
                : 'glass-hover'
                }`}
            onClick={onSelect}
        >
            {/* Image */}
            <div className="relative h-40 w-full overflow-hidden">
                <Image
                    src={activity.imageUrl}
                    alt={activity.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-2 left-2 text-3xl">{categoryEmoji[activity.category]}</div>
                {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary-500 text-white rounded-full p-1 animate-scale-in">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className="font-display font-semibold text-lg text-white truncate">{activity.name}</h3>

                <p className="text-sm text-gray-300 line-clamp-2">{activity.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{activity.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span>{activity.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>{priceSymbol(activity.priceLevel)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[140px]">{activity.location.address}</span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(activity.externalUrl, '_blank');
                        }}
                        className="text-primary-400 hover:text-primary-300 transition-colors p-1"
                        title="View details"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </button>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                    {activity.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs rounded-full bg-primary-500/20 text-primary-300"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Cost Display (New) */}
                {isSelected && (
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between animate-fade-in">
                        <span className="text-xs text-gray-400">Est. Cost:</span>
                        <div className="text-sm font-medium text-primary-400">
                            ${activity.estimatedCost || 0}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
