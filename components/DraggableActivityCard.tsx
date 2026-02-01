'use client';

import { Activity } from '@/types';
import { Plus } from 'lucide-react';

interface DraggableActivityCardProps {
    activity: Activity;
    onClick: () => void;
}

export default function DraggableActivityCard({ activity, onClick }: DraggableActivityCardProps) {
    return (
        <div
            onClick={onClick}
            className="group flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary-500/50 cursor-pointer transition-all active:scale-95"
            title="Click to add to story"
        >
            <img
                src={activity.imageUrl}
                alt={activity.name}
                className="w-12 h-12 rounded-md object-cover bg-slate-800"
            />
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-200 truncate group-hover:text-primary-400 transition-colors">
                    {activity.name}
                </div>
                <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add to story
                </div>
            </div>
        </div>
    );
}
