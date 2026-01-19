'use client';

import { useTripStore } from '@/lib/store';
import { DollarSign, PieChart, TrendingUp, AlertCircle, Edit2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function BudgetOverview() {
    const { dailyItineraries, totalBudget, currency, setTotalBudget, setCurrency } = useTripStore();
    const [isEditing, setIsEditing] = useState(false);
    const [tempBudget, setTempBudget] = useState(totalBudget.toString());

    // Calculate total spent
    const totalSpent = dailyItineraries.reduce((acc, day) => {
        return acc + day.timeSlots.reduce((dayAcc, slot) => {
            return dayAcc + (slot.activity?.estimatedCost || 0);
        }, 0);
    }, 0);

    const percentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

    // Determine status color
    let statusColor = 'bg-primary-500';
    let textColor = 'text-primary-400';

    if (percentage >= 100) {
        statusColor = 'bg-red-500';
        textColor = 'text-red-400';
    } else if (percentage >= 80) {
        statusColor = 'bg-orange-500';
        textColor = 'text-orange-400';
    }

    const handleSaveBudget = () => {
        const val = parseFloat(tempBudget);
        if (!isNaN(val) && val >= 0) {
            setTotalBudget(val);
        }
        setIsEditing(false);
    };

    // Update temp budget when store updates (e.g. from local storage load)
    useEffect(() => {
        setTempBudget(totalBudget.toString());
    }, [totalBudget]);

    if (dailyItineraries.length === 0) return null;

    return (
        <div className="glass rounded-xl p-6 mb-8 animate-fade-in relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">

                {/* Visual Icon */}
                <div className={`hidden md:flex w-16 h-16 rounded-full ${percentage >= 100 ? 'bg-red-500/20' : 'bg-primary-500/20'} items-center justify-center`}>
                    <DollarSign className={`w-8 h-8 ${textColor}`} />
                </div>

                {/* Budget Details */}
                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                            Estimated Cost vs Budget
                            {percentage >= 100 && (
                                <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                                    <AlertCircle className="w-3 h-3" /> Over Budget
                                </span>
                            )}
                        </h3>

                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <div className="flex items-center gap-2 animate-fade-in">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={tempBudget}
                                            onChange={(e) => setTempBudget(e.target.value)}
                                            className="w-24 px-2 py-1 pl-6 rounded bg-slate-800 border border-white/20 text-white focus:ring-2 focus:ring-primary-500 outline-none"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveBudget}
                                        className="p-1.5 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                                >
                                    <Edit2 className="w-3 h-3" /> Edit Budget
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 relative">
                        {/* Wrapper to allow exceeding 100% width if needed, though we clamp it visually usually */}
                        <div
                            className={`h-full ${statusColor} transition-all duration-1000 ease-out relative`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                        </div>
                    </div>

                    <div className="flex justify-between mt-2 text-sm">
                        <span className={`${textColor} font-medium`}>
                            ${totalSpent.toLocaleString()} Spent
                        </span>
                        <span className="text-gray-400">
                            Goal: ${totalBudget.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 border-l border-white/10 pl-6 hidden md:flex">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Items</p>
                        <p className="text-xl font-bold text-white">
                            {dailyItineraries.reduce((acc, day) => acc + day.timeSlots.filter(s => s.activity).length, 0)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Avg/Day</p>
                        <p className="text-xl font-bold text-white">
                            ${dailyItineraries.length > 0 ? Math.round(totalSpent / dailyItineraries.length) : 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-10 ${statusColor}`} />
        </div>
    );
}
