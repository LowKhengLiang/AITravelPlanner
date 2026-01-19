'use client';

import { useState, useMemo } from 'react';
import { useTripStore } from '@/lib/store';
import { activities } from '@/data/mockData';
import { Search, Plus, Check, MapPin, X } from 'lucide-react';
import { Activity } from '@/types';

export default function DestinationSelector() {
    const { selectedDestinations, addDestination, removeDestination, selectedRegion } = useTripStore();
    const [searchQuery, setSearchQuery] = useState('');

    const availableActivities = useMemo(() => {
        if (!selectedRegion) return [];
        return activities.filter(a =>
            (a.regionId === selectedRegion.id) &&
            (a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
            !selectedDestinations.find(d => d.id === a.id)
        );
    }, [selectedRegion, searchQuery, selectedDestinations]);

    if (!selectedRegion) return null;

    return (
        <div className="space-y-6">
            <div className="glass p-6 rounded-xl animate-fade-in">
                <h3 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-400" />
                    Select Destinations
                </h3>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search places, hotels, or activities..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-lg glass border border-white/10 text-white bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-500"
                    />
                </div>

                {/* Available List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {availableActivities.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                            {searchQuery ? 'No places found matching your search.' : 'All available places selected.'}
                        </p>
                    ) : (
                        availableActivities.map(activity => (
                            <div
                                key={activity.id}
                                className="group p-3 rounded-lg bg-slate-800/40 border border-white/5 hover:bg-slate-800/60 transition-all flex items-center gap-3 cursor-pointer"
                                onClick={() => addDestination(activity)}
                            >
                                <img
                                    src={activity.imageUrl}
                                    alt={activity.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-medium truncate">{activity.name}</h4>
                                    <p className="text-xs text-gray-400 truncate">{activity.category}</p>
                                </div>
                                <button className="p-2 rounded-full bg-primary-500/10 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Selected Bucket List */}
            {selectedDestinations.length > 0 && (
                <div className="glass p-6 rounded-xl animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-400" />
                            Bucket List ({selectedDestinations.length})
                        </h3>
                    </div>

                    <div className="space-y-2">
                        {selectedDestinations.map((activity, index) => (
                            <div
                                key={activity.id}
                                className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center gap-3 animate-fade-in"
                            >
                                <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center font-bold">
                                    {index + 1}
                                </span>
                                <span className="flex-1 text-white text-sm font-medium truncate">{activity.name}</span>
                                <button
                                    onClick={() => removeDestination(activity.id)}
                                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
