'use client';

import { Activity } from '@/types';
import { useMemo } from 'react';

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

interface RouteMapProps {
    activities: Activity[];
}

export default function RouteMap({ activities }: RouteMapProps) {
    // Generate simplified coordinates for visualization
    const points = useMemo(() => {
        return activities.map((activity, index) => {
            // Create a visually pleasing path (simulated for demo)
            // In a real app, we'd use activity.location.lat/lng with a map projection
            const x = 100 + (index % 3) * 150 + (Math.floor(index / 3) * 50);
            const y = 100 + Math.floor(index / 3) * 150 + ((index % 3) * 40);
            return { ...activity, x, y };
        });
    }, [activities]);

    if (activities.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
                No route to display
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 relative overflow-hidden rounded-xl">
            <div className="absolute inset-0 p-4 md:p-12 overflow-auto">
                <div className="min-w-[600px] min-h-[400px] relative">
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
                        {points.map((point, index) => {
                            if (index < points.length - 1) {
                                const nextPoint = points[index + 1];
                                return (
                                    <g key={`route-${index}`}>
                                        <path
                                            d={`M ${point.x} ${point.y} Q ${(point.x + nextPoint.x) / 2} ${(point.y + nextPoint.y) / 2 - 30} ${nextPoint.x} ${nextPoint.y}`}
                                            stroke="#14b8a6"
                                            strokeWidth="3"
                                            strokeDasharray="5,5"
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

                    {points.map((point, index) => (
                        <div
                            key={point.id}
                            className="absolute transition-all duration-300 hover:scale-110 cursor-pointer group"
                            style={{
                                left: `${point.x}px`,
                                top: `${point.y}px`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10,
                            }}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full glass flex items-center justify-center text-2xl border-2 border-primary-500 shadow-lg shadow-primary-500/50">
                                    {categoryEmoji[point.category] || '📍'}
                                </div>
                                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                    {point.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 glass p-3 rounded-lg text-xs md:text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-8 h-0.5 bg-primary-500 border-dashed" />
                    <span>Optimized Path</span>
                </div>
            </div>
        </div>
    );
}
