'use client';

import { useTripStore } from '@/lib/store';
import { countries, activities } from '@/data/mockData';
import CountrySelector from '@/components/CountrySelector';
import DaysSelector from '@/components/DaysSelector';
import TimeSlot from '@/components/TimeSlot';
import DayTabs from '@/components/DayTabs';
import BudgetOverview from '@/components/BudgetOverview';
import TripStats from '@/components/TripStats';
import PackingList from '@/components/PackingList';
import FlightOptions from '@/components/FlightOptions';
import DestinationNews from '@/components/DestinationNews';
import PublishButton from '@/components/PublishButton';
import CalendarView from '@/components/CalendarView';
import { Plane, Map, Sparkles, Trash2, Globe, Home } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function HomePage() {
    const {
        selectedCountry,
        selectedRegion,
        numberOfDays,
        dailyItineraries,
        currentDay,
        setSelectedCountry,
        setSelectedRegion,
        setNumberOfDays,
        setCurrentDay,
        selectActivity,
        removeActivity,
        autoPopulate,
        clearItinerary,
        clearActivities,
    } = useTripStore();

    const [isPlanning, setIsPlanning] = useState(false);

    const handleStartPlanning = () => {
        setIsPlanning(true);
    };

    const currentItinerary = dailyItineraries.find((it) => it.dayNumber === currentDay);

    const handleAutoPopulate = () => {
        if (selectedRegion) {
            const regionActivities = activities.filter((a) => a.regionId === selectedRegion.id);
            autoPopulate(regionActivities);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                                <Plane className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-coral-400 bg-clip-text text-transparent">
                                AI Travel Planner
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {isPlanning && (
                                <>
                                    <button
                                        onClick={() => setIsPlanning(false)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-white/10 text-gray-300 font-medium hover:bg-white/10 transition-all duration-300"
                                        title="Change Country/Region"
                                    >
                                        <Home className="w-4 h-4" />
                                        <span className="hidden md:inline">Change Destination</span>
                                    </button>

                                    <button
                                        onClick={handleAutoPopulate}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Auto-Fill
                                    </button>
                                    <Link
                                        href="/optimize"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Optimize
                                    </Link>
                                    <Link
                                        href="/community"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-blue-400/30 text-blue-300 font-medium hover:bg-blue-400/20 transition-all duration-300"
                                    >
                                        <Globe className="w-4 h-4" />
                                        Community
                                    </Link>
                                    <PublishButton />
                                    <Link
                                        href="/map"
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-primary-500/30 text-white font-medium hover:bg-primary-500/20 transition-all duration-300"
                                    >
                                        <Map className="w-4 h-4" />
                                        View Map
                                    </Link>
                                    <button
                                        onClick={clearActivities}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-red-500/30 text-red-400 font-medium hover:bg-red-500/20 transition-all duration-300"
                                        title="Clear activities only"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Clear
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Landing State */}
                {!isPlanning && (
                    <div className="max-w-4xl mx-auto animate-fade-in">
                        <div className="text-center mb-12">
                            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
                                Plan Your Dream <br />
                                <span className="text-transparent bg-gradient-to-r from-primary-400 to-coral-400 bg-clip-text">Adventure</span>
                            </h2>
                            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12">
                                Create personalized travel itineraries with AI-powered suggestions, interactive maps, and dynamic scheduling.
                            </p>

                            <div className="glass p-8 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                                        <CountrySelector
                                            countries={countries}
                                            selectedCountry={selectedCountry}
                                            selectedRegion={selectedRegion}
                                            onCountryChange={setSelectedCountry}
                                            onRegionChange={setSelectedRegion}
                                        />
                                        {selectedRegion && (
                                            <DaysSelector
                                                numberOfDays={numberOfDays}
                                                onDaysChange={setNumberOfDays}
                                            />
                                        )}
                                    </div>

                                    {selectedRegion && (
                                        <button
                                            onClick={handleStartPlanning}
                                            className="w-full md:w-auto mx-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-coral-500 hover:from-primary-400 hover:to-coral-400 text-white text-lg font-bold rounded-xl shadow-lg shadow-primary-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                                        >
                                            <Sparkles className="w-6 h-6" />
                                            Start Planning
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Features Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 opacity-80">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 text-blue-400">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Explore the World</h3>
                                <p className="text-gray-400">Discover new destinations and hidden gems with our curated database.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 text-purple-400">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">AI Optimization</h3>
                                <p className="text-gray-400">Let our AI organize your schedule for the most efficient and enjoyable trip.</p>
                            </div>
                            <div className="text-center p-6">
                                <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 text-green-400">
                                    <Map className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Visual Itineraries</h3>
                                <p className="text-gray-400">See your entire trip mapped out with beautiful, interactive visualizations.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Planner State */}
                {isPlanning && (
                    <div className="animate-slide-up">
                        {/* Features Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <BudgetOverview />
                            <TripStats />
                        </div>

                        {/* Logistics & Insights Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <FlightOptions />
                            <DestinationNews />
                        </div>

                        {/* Calendar View */}
                        <CalendarView />

                        {/* Day Tabs */}
                        <div className="sticky-tabs">
                            <DayTabs
                                numberOfDays={dailyItineraries.length}
                                currentDay={currentDay}
                                onDayChange={setCurrentDay}
                            />
                        </div>

                        {/* Current Day Title */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-display font-bold text-white">
                                Day {currentDay} - {selectedRegion?.name}
                            </h2>
                            <p className="text-gray-400 mt-1">Select activities for each time slot</p>
                        </div>

                        {/* Time Slots */}
                        {currentItinerary && (
                            <div className="space-y-6">
                                {currentItinerary.timeSlots.map((timeSlot) => {
                                    // Get activities suitable for this time
                                    const hour = parseInt(timeSlot.time.split(':')[0]);
                                    let categoryFilter: string[] = [];

                                    if (hour >= 9 && hour < 10) categoryFilter = ['breakfast', 'cafe', 'hotel'];
                                    else if (hour >= 10 && hour < 12) categoryFilter = ['temple', 'museum', 'attraction', 'culture'];
                                    else if (hour >= 12 && hour < 14) categoryFilter = ['lunch'];
                                    else if (hour >= 14 && hour < 18) categoryFilter = ['shopping', 'park', 'attraction', 'museum'];
                                    else if (hour >= 18 && hour < 20) categoryFilter = ['dinner'];
                                    else categoryFilter = ['nightlife', 'cafe', 'dinner'];

                                    const suitableActivities = activities.filter(
                                        (a) => selectedRegion && a.regionId === selectedRegion.id && categoryFilter.includes(a.category)
                                    );

                                    return (
                                        <TimeSlot
                                            key={timeSlot.id}
                                            timeSlot={timeSlot}
                                            availableActivities={suitableActivities}
                                            onSelectActivity={(activity) => selectActivity(currentDay, timeSlot.id, activity)}
                                            onRemoveActivity={() => removeActivity(currentDay, timeSlot.id)}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Global Tools that should always be available if planning or maybe moved? 
                    Actually PackingList makes sense in Planner. 
                */}
                {isPlanning && <PackingList />}

            </main>

            {/* Footer */}
            <footer className="mt-20 py-8 border-t border-white/10">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>AI Travel Planner • Plan smarter, travel better</p>
                </div>
            </footer>
        </div>
    );

}
