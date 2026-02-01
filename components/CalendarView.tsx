'use client';

import { useTripStore } from '@/lib/store';
import { Calendar as CalendarIcon, Clock, MapPin, List, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { useState } from 'react';

export default function CalendarView() {
    const { dailyItineraries, startDate } = useTripStore();
    const [viewMode, setViewMode] = useState<'month' | 'list'>('month');
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

    if (!dailyItineraries.length) return null;

    // Helper to get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    // Helper to get first day of month (0 = Sunday)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const nextMonth = () => {
        setCurrentMonthDate(new Date(currentMonthDate.setMonth(currentMonthDate.getMonth() + 1)));
    };

    const prevMonth = () => {
        setCurrentMonthDate(new Date(currentMonthDate.setMonth(currentMonthDate.getMonth() - 1)));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const renderMonthView = () => {
        const daysInMonth = getDaysInMonth(currentMonthDate);
        const firstDay = getFirstDayOfMonth(currentMonthDate);
        const days = [];

        // Empty slots for start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-32 bg-slate-900/30 border border-white/5"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            // Find itinerary for this date (assuming dailyItineraries have proper dates or mapping)
            // For now, we'll fuzzy match or just use the day index if dates aren't real
            // A real implementation would parse 'day.date' string.
            // Let's assume dailyItineraries[day-1] for simplicity if we started today, 
            // but correct logic checks the date string.

            const currentDateStr = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day).toDateString();
            const itineraryForDay = dailyItineraries.find(it => {
                if (!it.date) return false;
                // Robust date comparison: create Date objects from both strings and compare time-stripped values
                const itDate = new Date(it.date);
                const currDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
                return itDate.toDateString() === currDate.toDateString();
            });

            days.push(
                <div key={day} className="h-32 bg-slate-800/50 border border-white/5 p-2 hover:bg-slate-800 transition-colors relative group">
                    <span className={`text-sm font-bold ${itineraryForDay ? 'text-white' : 'text-gray-500'}`}>{day}</span>

                    {/* Activity Bars */}
                    {/* Activity Bars */}
                    {/* Activity Bars */}
                    <div className="mt-1 space-y-1 overflow-hidden custom-scrollbar">
                        {itineraryForDay && (() => {
                            const activities = itineraryForDay.timeSlots.filter(s => s.activity);
                            const displayActivities = activities.slice(0, 3);
                            const remaining = activities.length - 3;

                            return (
                                <>
                                    {displayActivities.map((slot, idx) => (
                                        <div
                                            key={idx}
                                            className="text-[10px] bg-primary-500/20 text-primary-200 px-1 py-0.5 rounded truncate border-l-2 border-primary-500"
                                            title={`${slot.time} - ${slot.activity?.name}`}
                                        >
                                            {slot.activity?.name}
                                        </div>
                                    ))}
                                    {remaining > 0 && (
                                        <div className="text-[10px] text-gray-400 pl-1 italic">
                                            +{remaining} more...
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>

                    {itineraryForDay && (
                        <button
                            onClick={() => setViewMode('list')}
                            className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-white/10 hover:bg-white/20 p-1 rounded transition-all"
                            title="View Details"
                        >
                            <List className="w-3 h-3 text-white" />
                        </button>
                    )}
                </div>
            );
        }

        return (
            <div className="animate-fade-in">
                {/* Month Controls */}
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white">
                        {monthNames[currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                    </h4>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded"><ChevronLeft className="w-5 h-5 text-gray-400" /></button>
                        <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded"><ChevronRight className="w-5 h-5 text-gray-400" /></button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="bg-slate-900/80 p-2 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            {d}
                        </div>
                    ))}
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div className="glass rounded-xl p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-primary-400" />
                    Itinerary Calendar
                </h3>

                {/* View Toggle */}
                <div className="flex bg-slate-900/50 rounded-lg p-1 border border-white/5">
                    <button
                        onClick={() => setViewMode('month')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'month'
                            ? 'bg-primary-500 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Month
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'list'
                            ? 'bg-primary-500 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <List className="w-4 h-4" />
                        List
                    </button>
                </div>
            </div>

            {viewMode === 'month' ? renderMonthView() : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
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
            )}
        </div>
    );
}
