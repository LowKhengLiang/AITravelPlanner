'use client';

import { useTripStore } from '@/lib/store';
import { airlines } from '@/data/mockData';
import { Plane, ArrowRight, Tag } from 'lucide-react';
import { useMemo } from 'react';

export default function FlightOptions() {
    const { selectedCountry } = useTripStore();

    const availableFlights = useMemo(() => {
        if (!selectedCountry) return [];
        return airlines.filter(a => a.countryId === selectedCountry.id || a.countryId === 'any');
    }, [selectedCountry]);

    if (!selectedCountry) return null;

    return (
        <div className="glass rounded-xl p-6 mb-8 animate-fade-in relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-500" />

            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <Plane className="w-6 h-6 text-purple-400" />
                Flights to {selectedCountry.name}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {availableFlights.map((airline) => (
                    <div
                        key={airline.id}
                        className="bg-slate-800/50 hover:bg-slate-800/80 p-4 rounded-lg flex items-center justify-between border border-white/5 hover:border-purple-500/30 transition-all group/card cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="text-2xl w-10 text-center">{airline.logo}</div>
                            <div>
                                <h4 className="text-white font-semibold">{airline.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <span>Direct</span>
                                    <ArrowRight className="w-3 h-3" />
                                    <span>{selectedCountry.name}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-lg font-bold text-green-400">
                                ${airline.baseCost}
                            </div>
                            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 ml-auto w-fit">
                                <Tag className="w-3 h-3" />
                                Est. Price
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
                * Prices are estimates for round-trip flights in Economy class.
            </div>
        </div>
    );
}
