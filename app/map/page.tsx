'use client';

import { useTripStore } from '@/lib/store';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Category icons for map markers
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

export default function MapPage() {
    const { dailyItineraries, currentDay, selectedRegion } = useTripStore();
    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedActivity, setSelectedActivity] = useState<any>(null);

    const currentItinerary = dailyItineraries.find((it) => it.dayNumber === currentDay);
    const activitiesWithLocation = currentItinerary?.timeSlots
        .filter((slot) => slot.activity)
        .map((slot, index) => ({ ...slot.activity!, order: index + 1, time: slot.time })) || [];

    useEffect(() => {
        if (!selectedRegion || activitiesWithLocation.length === 0) return;

        // Simple map visualization using embedded Google Maps (no API key needed for basic view)
        // In production, you would use Mapbox GL JS here
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [selectedRegion, activitiesWithLocation]);

    if (!selectedRegion || dailyItineraries.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-display font-bold text-white mb-4">No Itinerary Found</h2>
                    <p className="text-gray-400 mb-6">Please create an itinerary first</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Planning
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors self-start md:self-auto"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Back to Planning</span>
                        </Link>
                        <h1 className="text-xl font-display font-bold text-white text-center">
                            Day {currentDay} - Map View
                        </h1>
                        <div className="hidden md:block w-32" /> {/* Spacer for centering */}
                    </div>
                </div>
            </header>

            {/* Map Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Map Area */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-2xl overflow-hidden h-[400px] lg:h-[600px] relative">
                            {/* Simple visual map representation */}
                            <div
                                ref={mapRef}
                                className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 relative flex items-center justify-center"
                            >
                                {/* Route visualization */}
                                <div className="relative w-full h-full p-12">
                                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                                        <defs>
                                            <marker
                                                id="arrowhead"
                                                markerWidth="10"
                                                markerHeight="10"
                                                refX="5"
                                                refY="3"
                                                orient="auto"
                                            >
                                                <polygon points="0 0, 10 3, 0 6" fill="#14b8a6" opacity="0.6" />
                                            </marker>
                                        </defs>
                                        {activitiesWithLocation.map((activity, index) => {
                                            if (index < activitiesWithLocation.length - 1) {
                                                const x1 = 100 + index * 150;
                                                const y1 = 250 + Math.sin(index) * 100;
                                                const x2 = 100 + (index + 1) * 150;
                                                const y2 = 250 + Math.sin(index + 1) * 100;

                                                return (
                                                    <g key={`route-${index}`}>
                                                        <path
                                                            d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 - 50} ${x2} ${y2}`}
                                                            stroke="#14b8a6"
                                                            strokeWidth="3"
                                                            fill="none"
                                                            opacity="0.6"
                                                            markerEnd="url(#arrowhead)"
                                                            className="animate-pulse"
                                                        />
                                                    </g>
                                                );
                                            }
                                            return null;
                                        })}
                                    </svg>

                                    {/* Activity markers */}
                                    {activitiesWithLocation.map((activity, index) => {
                                        const x = 100 + index * 150;
                                        const y = 250 + Math.sin(index) * 100;

                                        return (
                                            <div
                                                key={activity.id}
                                                className="absolute transition-all duration-300 hover:scale-125 cursor-pointer"
                                                style={{
                                                    left: `${x}px`,
                                                    top: `${y}px`,
                                                    transform: 'translate(-50%, -50%)',
                                                    zIndex: 10,
                                                }}
                                                onClick={() => setSelectedActivity(activity)}
                                            >
                                                <div className="relative">
                                                    <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-3xl border-2 border-primary-500 shadow-lg shadow-primary-500/50 hover:shadow-primary-500/80 transition-all">
                                                        {categoryEmoji[activity.category]}
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">
                                                        {activity.order}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Legend */}
                                <div className="absolute bottom-4 left-4 glass p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-white mb-2">Legend</h3>
                                    <div className="space-y-1 text-xs text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-primary-500" />
                                            <span>Activity Location</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-0.5 bg-primary-500" />
                                            <span>Travel Route</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="mt-4 glass p-4 rounded-lg">
                            <p className="text-sm text-gray-400">
                                <strong className="text-white">Note:</strong> This is a simplified map visualization.
                                In production, this would use Mapbox GL JS with real coordinates, routing, and interactive features.
                            </p>
                        </div>
                    </div>

                    {/* Activity List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-display font-bold text-white">Itinerary Timeline</h2>

                        {activitiesWithLocation.length === 0 ? (
                            <div className="glass p-6 rounded-lg text-center">
                                <p className="text-gray-400">No activities selected yet</p>
                            </div>
                        ) : (
                            activitiesWithLocation.map((activity) => (
                                <div
                                    key={activity.id}
                                    className={`glass p-4 rounded-lg cursor-pointer transition-all duration-300 ${selectedActivity?.id === activity.id
                                        ? 'ring-2 ring-primary-500 shadow-lg shadow-primary-500/30'
                                        : 'hover:bg-white/10'
                                        }`}
                                    onClick={() => setSelectedActivity(activity)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full glass flex items-center justify-center text-xl border border-primary-500/30">
                                            {categoryEmoji[activity.category]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium text-primary-400">{activity.time}</span>
                                                <span className="text-xs text-gray-500">•</span>
                                                <span className="text-xs text-gray-400">{activity.duration} min</span>
                                            </div>
                                            <h3 className="font-medium text-white truncate">{activity.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1">{activity.location.address}</p>
                                            <div className="mt-2">
                                                <a
                                                    href={activity.externalUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    View Details →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
