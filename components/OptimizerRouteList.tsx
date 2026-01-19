'use client';

import { useTripStore } from '@/lib/store';
import { ArrowDown, Car, Clock, Map, Navigation, BedDouble, Bus } from 'lucide-react';

export default function OptimizerRouteList() {
    const { optimizedRoute, selectedDestinations } = useTripStore();

    // Show either the optimized route or just the selected list if not optimized yet
    const displayList = optimizedRoute.length > 0 ? optimizedRoute : selectedDestinations;

    if (displayList.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-400">
                <Navigation className="w-16 h-16 mb-4 opacity-20" />
                <p>Select destinations from the list to start planning your route.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {displayList.map((activity, index) => {
                // Simulate distance/condition for suggestions
                const isLongDistance = index > 0 && index % 3 === 0;
                const showTransport = index > 0;

                return (
                    <div key={activity.id} className="relative animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                        {/* Connection Line */}
                        {index < displayList.length - 1 && (
                            <div className="absolute left-[27px] top-12 bottom-[-16px] w-0.5 bg-gradient-to-b from-primary-500 to-primary-500/20 -z-10" />
                        )}

                        {/* Suggestions */}
                        {showTransport && (
                            <div className="ml-12 mb-4 space-y-2">
                                {/* Transport */}
                                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center gap-3">
                                    {isLongDistance ? <Bus className="w-4 h-4 text-blue-400" /> : <Car className="w-4 h-4 text-blue-400" />}
                                    <div className="text-xs text-blue-300">
                                        <span className="font-bold">Transport:</span> {isLongDistance ? 'Take a Bus/Train (approx. 2h)' : 'Take a Grab (approx. 15 mins)'}
                                    </div>
                                </div>

                                {/* Hotel - Only for "long legs" */}
                                {isLongDistance && (
                                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
                                        <BedDouble className="w-4 h-4 text-purple-400" />
                                        <div className="text-xs text-purple-300">
                                            <span className="font-bold">Stay Nearby:</span> Suggested: "Grand Hotel & Spa"
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-start gap-4 p-4 rounded-xl glass border border-white/5 hover:border-primary-500/30 transition-all">
                            <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30">
                                {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold truncate">{activity.name}</h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Map className="w-3 h-3" />
                                        {activity.location.address}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {activity.duration}m
                                    </span>
                                </div>
                            </div>

                            <img
                                src={activity.imageUrl}
                                alt={activity.name}
                                className="w-16 h-16 rounded-lg object-cover bg-slate-800"
                            />
                        </div>

                        {index < displayList.length - 1 && (
                            <div className="ml-[22px] my-2 text-gray-600">
                                <ArrowDown className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
