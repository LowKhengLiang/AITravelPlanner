'use client';

import { useTripStore } from '@/lib/store';
import DestinationSelector from '@/components/DestinationSelector';
import OptimizerRouteList from '@/components/OptimizerRouteList';
import RouteMap from '@/components/RouteMap';
import DaysSelector from '@/components/DaysSelector';
import OptimizedImportControls from '@/components/OptimizedImportControls';
import { Sparkles, Map, ArrowLeft, RotateCw, Settings } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { Activity } from '@/types';

export default function OptimizePage() {
    const { selectedDestinations, optimizedRoute, setOptimizedRoute, clearItinerary, numberOfDays, setNumberOfDays } = useTripStore();
    const [isOptimizing, setIsOptimizing] = useState(false);

    // Euclidean distance for simplicity (can use Haversine for real lat/lng)
    const getDistance = (a: Activity, b: Activity) => {
        return Math.sqrt(
            Math.pow(a.location.lat - b.location.lat, 2) +
            Math.pow(a.location.lng - b.location.lng, 2)
        );
    };

    const handleOptimize = useCallback(async () => {
        if (selectedDestinations.length < 2) return;

        setIsOptimizing(true);

        // Simulate "AI" processing time
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Nearest Neighbor Algorithm
        const remaining = [...selectedDestinations];
        const route: Activity[] = [];

        // Start with the first selected item
        let current = remaining[0];
        route.push(current);
        remaining.splice(0, 1);

        while (remaining.length > 0) {
            let nearest = remaining[0];
            let minDist = getDistance(current, nearest);

            for (let i = 1; i < remaining.length; i++) {
                const dist = getDistance(current, remaining[i]);
                if (dist < minDist) {
                    minDist = dist;
                    nearest = remaining[i];
                }
            }

            route.push(nearest);
            current = nearest;
            remaining.splice(remaining.indexOf(nearest), 1);
        }

        setOptimizedRoute(route);
        setIsOptimizing(false);
    }, [selectedDestinations, setOptimizedRoute]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors self-start md:self-auto">
                        <ArrowLeft className="w-5 h-5 shrink-0" />
                        <span className="font-medium">Back to Planner</span>
                    </Link>
                    <h1 className="text-xl font-display font-bold text-white flex items-center gap-2 text-center flex-wrap justify-center">
                        <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                        AI Route Optimizer
                    </h1>
                    <div className="hidden md:block w-32"></div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Panel: Selection */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Settings Card */}
                        <div className="glass p-6 rounded-xl">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-400" />
                                Trip Settings
                            </h2>
                            <DaysSelector numberOfDays={numberOfDays} onDaysChange={setNumberOfDays} />
                        </div>

                        <div className="glass p-6 rounded-xl">
                            <h2 className="text-lg font-bold text-white mb-2">1. Choose Destinations</h2>
                            <p className="text-sm text-gray-400 mb-6">Select places you want to visit. We&apos;ll verify coordinates and proximity.</p>
                            <DestinationSelector />
                        </div>

                        <button
                            onClick={handleOptimize}
                            disabled={selectedDestinations.length < 2 || isOptimizing}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isOptimizing ? (
                                <>
                                    <RotateCw className="w-5 h-5 animate-spin" />
                                    Optimizing Route...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Optimize Route
                                </>
                            )}
                        </button>

                        <OptimizedImportControls />
                    </div>

                    {/* Right Panel: Result & Map */}
                    <div className="lg:col-span-8">
                        <div className="glass p-6 rounded-xl min-h-[600px]">
                            <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                                <span>2. Your Optimized Journey</span>
                                <span className="text-sm font-normal text-gray-400">
                                    {selectedDestinations.length} Stops
                                </span>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <OptimizerRouteList />

                                <div className="bg-slate-900/50 rounded-xl border border-white/5 h-[500px] relative overflow-hidden">
                                    <RouteMap activities={selectedDestinations.length > 0 ? (optimizedRoute.length > 0 ? optimizedRoute : selectedDestinations) : []} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
