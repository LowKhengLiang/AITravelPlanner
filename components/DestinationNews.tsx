'use client';

import { useTripStore } from '@/lib/store';
import { newsUpdates } from '@/data/mockData';
import { Newspaper, Bell, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { useMemo } from 'react';

export default function DestinationNews() {
    const { selectedCountry } = useTripStore();

    const updates = useMemo(() => {
        if (!selectedCountry) return [];
        return newsUpdates.filter(n => n.countryId === selectedCountry.id);
    }, [selectedCountry]);

    if (!selectedCountry || updates.length === 0) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'alert': return <ShieldAlert className="w-4 h-4 text-red-400" />;
            case 'deal': return <TrendingUp className="w-4 h-4 text-green-400" />;
            case 'hidden_gem': return <Sparkles className="w-4 h-4 text-purple-400" />;
            default: return <Bell className="w-4 h-4 text-blue-400" />;
        }
    };

    return (
        <div className="glass rounded-xl p-6 mb-8 animate-fade-in">
            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-blue-400" />
                Latest Updates: {selectedCountry.name}
            </h3>

            <div className="grid grid-cols-1 gap-4">
                {updates.map((item) => (
                    <div
                        key={item.id}
                        className="bg-slate-800/40 p-4 rounded-lg border border-white/5 flex gap-4 hover:bg-slate-800/60 transition-colors"
                    >
                        <div className="flex-shrink-0 mt-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5`}>
                                {getIcon(item.type)}
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-wide border ${item.type === 'alert' ? 'border-red-500/30 text-red-400 bg-red-500/10' :
                                        item.type === 'deal' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                                            item.type === 'hidden_gem' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' :
                                                'border-blue-500/30 text-blue-400 bg-blue-500/10'
                                    }`}>
                                    {item.type.replace('_', ' ')}
                                </span>
                                <span className="text-xs text-gray-500">{item.date}</span>
                            </div>
                            <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">{item.summary}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
