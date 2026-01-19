'use client';

import { useTripStore } from '@/lib/store';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

export default function CalendarView() {
    const { dailyItineraries, startDate } = useTripStore();

    if (!dailyItineraries.length) return null;

    return (
        <div className="glass rounded-xl p-6 mb-8 animate-fade-in">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-primary-400" />
                Itinerary Calendar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dailyItineraries.map((day) => (
                    <div
                        key={day.dayNumber}
                        className="bg-slate-800/50 rounded-lg p-4 border border-white/5 hover:border-primary-500/30 transition-all h-full"
                    >
                        {/* Date Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                            <span className="text-primary-400 font-bold">Day {day.dayNumber}</span>
                            <span className="text-sm text-gray-400">{day.date || 'Date TBD'}</span>
                        </div>

                        {/* Activities Summary */}
                        <div className="space-y-2">
                            {day.timeSlots.filter(s => s.activity).length === 0 ? (
                                <p className="text-xs text-gray-500 italic">No activities planned</p>
                            ) : (
                                day.timeSlots
                                    .filter(s => s.activity)
                                    .map(slot => (
                                        <div key={slot.id} className="flex gap-2 text-sm">
                                            <span className="text-gray-500 text-xs w-10">{slot.time}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-200 truncate">{slot.activity?.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                                    <MapPin className="w-3 h-3" />
                                                    {slot.activity?.location.address}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
