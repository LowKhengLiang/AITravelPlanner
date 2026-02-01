'use client';

import { TripState } from '@/types';
import { MapPin, Clock, DollarSign, Calendar } from 'lucide-react';
import { useState } from 'react';

interface ItineraryPreviewProps {
    trip: TripState;
}

export default function ItineraryPreview({ trip }: ItineraryPreviewProps) {
    const [selectedDay, setSelectedDay] = useState(1);
    const dayItinerary = trip.dailyItineraries.find(d => d.dayNumber === selectedDay);

    return (
        <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary-400" />
                        Itinerary Details
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{trip.numberOfDays} Days • {trip.selectedRegion?.name}, {trip.selectedCountry?.name}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-400">Total Budget</div>
                    <div className="text-xl font-bold text-emerald-400">${trip.totalBudget}</div>
                </div>
            </div>

            {/* Day Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                {trip.dailyItineraries.map(day => (
                    <button
                        key={day.dayNumber}
                        onClick={() => setSelectedDay(day.dayNumber)}
                        className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${selectedDay === day.dayNumber ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                    >
                        Day {day.dayNumber}
                    </button>
                ))}
            </div>

            {/* Timelines */}
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {dayItinerary?.timeSlots.filter(s => s.activity).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No activities planned for this day.</div>
                ) : (
                    dayItinerary?.timeSlots.filter(s => s.activity).map((slot, index) => (
                        <div key={slot.id} className="relative pl-6 pb-6 last:pb-0 border-l border-white/10 ml-2">
                            {/* Dot */}
                            <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-primary-500 shadow-lg shadow-primary-500/50" />

                            {/* Card */}
                            <div className="flex gap-4">
                                <div className="text-xs font-mono text-gray-500 pt-0.5 w-12">{slot.time}</div>
                                <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="font-bold text-gray-200">{slot.activity!.name}</h4>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {slot.activity!.duration}m
                                                </span>
                                                {slot.activity!.estimatedCost && (
                                                    <span className="flex items-center gap-1 text-emerald-400">
                                                        <DollarSign className="w-3 h-3" /> {slot.activity!.estimatedCost}
                                                    </span>
                                                )}
                                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] uppercase tracking-wider">
                                                    {slot.activity!.category}
                                                </span>
                                            </div>
                                        </div>
                                        <img
                                            src={slot.activity!.imageUrl}
                                            alt={slot.activity!.name}
                                            className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
