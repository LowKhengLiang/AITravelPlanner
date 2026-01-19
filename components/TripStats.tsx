'use client';

import { useTripStore } from '@/lib/store';
import { ActivityCategory } from '@/types';
import { PieChart } from 'lucide-react';

const categoryColors: Record<string, string> = {
    temple: '#f59e0b', // amber
    shopping: '#ec4899', // pink
    food: '#ef4444', // red (breakfast/lunch/dinner/cafe)
    nature: '#10b981', // emerald (park)
    culture: '#8b5cf6', // violet (museum/culture)
    nightlife: '#3b82f6', // blue
    other: '#64748b', // slate
};

export default function TripStats() {
    const { dailyItineraries } = useTripStore();

    if (dailyItineraries.length === 0) return null;

    // Aggregate stats
    const stats: Record<string, number> = {};
    let totalActivities = 0;

    dailyItineraries.forEach(day => {
        day.timeSlots.forEach(slot => {
            if (slot.activity) {
                totalActivities++;
                let key = 'other';
                const cat = slot.activity.category;

                if (['breakfast', 'lunch', 'dinner', 'cafe'].includes(cat)) key = 'food';
                else if (['temple', 'attraction'].includes(cat)) key = 'temple';
                else if (['museum', 'culture'].includes(cat)) key = 'culture';
                else if (['park'].includes(cat)) key = 'nature';
                else if (['shopping'].includes(cat)) key = 'shopping';
                else if (['nightlife'].includes(cat)) key = 'nightlife';

                stats[key] = (stats[key] || 0) + 1;
            }
        });
    });

    if (totalActivities === 0) return null;

    const data = Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .map(([key, count]) => ({
            key,
            count,
            percentage: (count / totalActivities) * 100,
            color: categoryColors[key] || categoryColors.other,
            label: key.charAt(0).toUpperCase() + key.slice(1)
        }));

    return (
        <div className="glass rounded-xl p-6 mb-8 animate-fade-in">
            <h3 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary-400" />
                Trip Vibe
            </h3>

            <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Visual Bar Chart */}
                <div className="flex-1 w-full space-y-3">
                    {data.map((item) => (
                        <div key={item.key} className="relative">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-300 font-medium">{item.label}</span>
                                <span className="text-gray-400">{Math.round(item.percentage)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${item.percentage}%`,
                                        backgroundColor: item.color
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary Text */}
                <div className="w-full md:w-48 text-center md:text-left">
                    <p className="text-sm text-gray-400 mb-2">Dominant Vibe</p>
                    <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                        {data[0]?.label || 'Balanced'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                        Based on {totalActivities} activities
                    </p>
                </div>
            </div>
        </div>
    );
}
