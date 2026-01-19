'use client';

import { TimeSlot as TimeSlotType, Activity } from '@/types';
import ActivityCard from './ActivityCard';
import { useRef } from 'react';

interface TimeSlotProps {
    timeSlot: TimeSlotType;
    availableActivities: Activity[];
    onSelectActivity: (activity: Activity) => void;
    onRemoveActivity: () => void;
}

export default function TimeSlot({
    timeSlot,
    availableActivities,
    onSelectActivity,
    onRemoveActivity,
}: TimeSlotProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="mb-8 animate-fade-in">
            {/* Time Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full glass border-2 border-primary-500/30">
                    <span className="text-2xl font-display font-bold text-primary-400">{timeSlot.time}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-primary-500/50 to-transparent" />
            </div>

            {/* Activity Cards Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {availableActivities.length > 0 ? (
                    availableActivities.map((activity) => (
                        <ActivityCard
                            key={activity.id}
                            activity={activity}
                            isSelected={timeSlot.activity?.id === activity.id}
                            onSelect={() => {
                                if (timeSlot.activity?.id === activity.id) {
                                    onRemoveActivity();
                                } else {
                                    onSelectActivity(activity);
                                }
                            }}
                        />
                    ))
                ) : (
                    <div className="flex items-center justify-center w-full h-40 glass rounded-xl">
                        <p className="text-gray-400 text-sm">No activities available for this time</p>
                    </div>
                )}
            </div>

            {/* Selected Activity Indicator */}
            {timeSlot.activity && (
                <div className="mt-3 px-4 py-2 glass rounded-lg border border-primary-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
                        <span className="text-sm text-gray-300">
                            Selected: <span className="text-white font-medium">{timeSlot.activity.name}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Cost:</span>
                            <input
                                type="number"
                                value={timeSlot.activity.estimatedCost || 0}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    // access store directly or pass prop? Passing prop is better given the structure.
                                    // But wait, the prop onSelectActivity expects a whole Activity object.
                                    // We should probably inject the store hook here or lift state.
                                    // For now, let's assume we can re-select with updated cost.
                                    onSelectActivity({ ...timeSlot.activity!, estimatedCost: val });
                                }}
                                className="w-20 px-2 py-1 rounded bg-slate-900 border border-white/10 text-white text-sm focus:ring-1 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <button
                            onClick={onRemoveActivity}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1 rounded-full bg-red-500/10 hover:bg-red-500/20"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
}
