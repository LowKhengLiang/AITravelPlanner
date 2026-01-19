'use client';

import { Calendar } from 'lucide-react';

interface DayTabsProps {
    numberOfDays: number;
    currentDay: number;
    onDayChange: (day: number) => void;
}

export default function DayTabs({ numberOfDays, currentDay, onDayChange }: DayTabsProps) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Calendar className="w-5 h-5 text-primary-400 flex-shrink-0" />
            {Array.from({ length: numberOfDays }, (_, i) => i + 1).map((day) => (
                <button
                    key={day}
                    onClick={() => onDayChange(day)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${currentDay === day
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/50 scale-105'
                            : 'glass text-gray-300 hover:text-white hover:glass-hover'
                        }`}
                >
                    Day {day}
                </button>
            ))}
        </div>
    );
}
