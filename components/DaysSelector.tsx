'use client';

import { Calendar, Clock } from 'lucide-react';
import { useTripStore } from '@/lib/store';

interface DaysSelectorProps {
    numberOfDays: number;
    onDaysChange: (days: number) => void;
    disabled?: boolean;
}

export default function DaysSelector({ numberOfDays, onDaysChange, disabled }: DaysSelectorProps) {
    const { startDate, setStartDate } = useTripStore();

    return (
        <div className="flex gap-4 flex-wrap">
            {/* Days Count */}
            <div className="flex-1 min-w-[200px]">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Clock className="w-4 h-4" />
                    Trip Duration
                </label>
                <select
                    value={numberOfDays}
                    onChange={(e) => onDaysChange(parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full px-4 py-3 rounded-lg glass border border-white/10 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                        <option key={days} value={days} className="bg-slate-800">
                            {days} {days === 1 ? 'Day' : 'Days'}
                        </option>
                    ))}
                </select>
            </div>

            {/* Start Date */}
            <div className="flex-1 min-w-[200px]">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4" />
                    Start Date
                </label>
                <input
                    type="date"
                    value={startDate || ''}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg glass border border-white/10 text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer disabled:opacity-50"
                    style={{ colorScheme: 'dark' }}
                />
            </div>
        </div>
    );
}
