import { create } from 'zustand';
import { Country, Region, Activity, DayItinerary, TimeSlot } from '@/types';

interface TripStore {
    selectedCountry: Country | null;
    selectedRegion: Region | null;
    numberOfDays: number;
    dailyItineraries: DayItinerary[];
    currentDay: number;
    startDate: string | null;

    totalBudget: number;
    currency: string;

    // Optimizer State
    selectedDestinations: Activity[];
    optimizedRoute: Activity[];

    setSelectedCountry: (country: Country | null) => void;
    setSelectedRegion: (region: Region | null) => void;
    setNumberOfDays: (days: number) => void;
    setCurrentDay: (day: number) => void;
    selectActivity: (dayNumber: number, timeSlotId: string, activity: Activity) => void;
    removeActivity: (dayNumber: number, timeSlotId: string) => void;
    initializeDays: () => void;
    autoPopulate: (activities: Activity[]) => void;
    clearItinerary: () => void;
    saveToStorage: () => void;
    setTotalBudget: (amount: number) => void;
    setCurrency: (currency: string) => void;
    updateActivityCost: (dayNumber: number, timeSlotId: string, cost: number) => void;
    setStartDate: (date: string | null) => void;

    // Optimizer Actions
    addDestination: (activity: Activity) => void;
    removeDestination: (id: string) => void;
    setOptimizedRoute: (route: Activity[]) => void;
    generateSuggestions: () => void;
    importOptimizedRoute: () => void;
}

const generateTimeSlots = (startTime: string = '09:00'): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    let hour = parseInt(startTime.split(':')[0]);
    let minute = parseInt(startTime.split(':')[1]);

    // Generate slots from 9 AM to 9 PM (12 hours)
    for (let i = 0; i < 8; i++) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
            id: `slot-${i}`,
            time: timeString,
        });

        // Increment by 90 minutes for spacing
        minute += 90;
        if (minute >= 60) {
            hour += Math.floor(minute / 60);
            minute = minute % 60;
        }
    }

    return slots;
};

const recalculateTimeSlots = (slots: TimeSlot[]): TimeSlot[] => {
    let currentHour = 9;
    let currentMinute = 0;

    return slots.map((slot, index) => {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        const newSlot = { ...slot, time: timeString };

        // If there's an activity, add its duration + buffer
        if (slot.activity) {
            const duration = slot.activity.duration + 15; // 15 min buffer
            currentMinute += duration;

            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
        } else {
            // Default spacing if no activity
            currentMinute += 90;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
        }

        return newSlot;
    });
};

export const useTripStore = create<TripStore>((set, get) => {
    // Load initial state from localStorage if available
    const loadFromStorage = () => {
        if (typeof window === 'undefined') return null;
        try {
            const stored = localStorage.getItem('ai-travel-planner-state');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    };

    const savedState = loadFromStorage();

    return {
        selectedCountry: savedState?.selectedCountry || null,
        selectedRegion: savedState?.selectedRegion || null,
        numberOfDays: savedState?.numberOfDays || 3,
        dailyItineraries: savedState?.dailyItineraries || [],
        currentDay: savedState?.currentDay || 1,
        startDate: savedState?.startDate || null,
        totalBudget: savedState?.totalBudget || 0,
        currency: savedState?.currency || 'USD',
        selectedDestinations: savedState?.selectedDestinations || [],
        optimizedRoute: savedState?.optimizedRoute || [],

        setSelectedCountry: (country) => {
            set({ selectedCountry: country, selectedRegion: null });
            get().saveToStorage();
        },

        setSelectedRegion: (region) => {
            set({ selectedRegion: region });
            get().initializeDays();
            get().saveToStorage();
        },

        setNumberOfDays: (days) => {
            set({ numberOfDays: days });
            get().initializeDays();
            get().saveToStorage();
        },

        setCurrentDay: (day) => {
            set({ currentDay: day });
            get().saveToStorage();
        },

        setTotalBudget: (amount) => {
            set({ totalBudget: amount });
            get().saveToStorage();
        },

        setCurrency: (curr) => {
            set({ currency: curr });
            get().saveToStorage();
        },

        updateActivityCost: (dayNumber, timeSlotId, cost) => {
            const { dailyItineraries } = get();
            const updatedItineraries = dailyItineraries.map(itinerary => {
                if (itinerary.dayNumber === dayNumber) {
                    const updatedSlots = itinerary.timeSlots.map(slot =>
                        slot.id === timeSlotId && slot.activity
                            ? { ...slot, activity: { ...slot.activity, estimatedCost: cost } }
                            : slot
                    );
                    return { ...itinerary, timeSlots: updatedSlots };
                }
                return itinerary;
            });

            set({ dailyItineraries: updatedItineraries });
            get().saveToStorage();
        },

        setStartDate: (date) => {
            set({ startDate: date });
            get().initializeDays();
            get().saveToStorage();
        },

        addDestination: (activity) => {
            const { selectedDestinations } = get();
            if (!selectedDestinations.find(d => d.id === activity.id)) {
                set({ selectedDestinations: [...selectedDestinations, activity] });
                get().saveToStorage();
            }
        },

        removeDestination: (id) => {
            const { selectedDestinations } = get();
            set({ selectedDestinations: selectedDestinations.filter(d => d.id !== id) });
            get().saveToStorage();
        },

        setOptimizedRoute: (route) => {
            set({ optimizedRoute: route });
            get().saveToStorage();
        },

        generateSuggestions: () => {
            const { numberOfDays, selectedRegion, selectedDestinations, optimizedRoute } = get();
            if (!selectedRegion) return;

            // Target: ~4 activities per day
            const targetCount = numberOfDays * 4;
            const currentCount = selectedDestinations.length;
            const needed = targetCount - currentCount;

            if (needed <= 0) return;

            // Import activities dynamically to avoid circular dependencies if possible, 
            // but for now we use the mocked ones imported at top.
            // In a real app, this would be an API call.
            const { activities } = require('@/data/mockData');

            // Find available activities in region not already selected
            const available = activities.filter((a: Activity) =>
                a.regionId === selectedRegion.id &&
                !selectedDestinations.find(d => d.id === a.id)
            );

            // Simple random selection for now
            const newSuggestions: Activity[] = [];
            const pool = [...available];

            for (let i = 0; i < needed && pool.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * pool.length);
                newSuggestions.push(pool[randomIndex]);
                pool.splice(randomIndex, 1);
            }

            // Add to selected destinations
            const updatedDestinations = [...selectedDestinations, ...newSuggestions];
            set({ selectedDestinations: updatedDestinations });

            // If we had an optimized route, we should probably clear it or re-optimize.
            // For now, let's clear it to force user to re-optimize.
            set({ optimizedRoute: [] });
            get().saveToStorage();
        },

        importOptimizedRoute: () => {
            const { optimizedRoute, numberOfDays, selectedRegion } = get();
            if (optimizedRoute.length === 0 || !selectedRegion) return;

            // 1. Reset Itineraries based on current numberOfDays
            get().initializeDays();

            // 2. Distribute activities across days
            const { dailyItineraries } = get();
            const itemsPerDay = Math.ceil(optimizedRoute.length / numberOfDays);

            const updatedItineraries = dailyItineraries.map((itinerary) => {
                const dayIndex = itinerary.dayNumber - 1;
                const dailyActivities = optimizedRoute.slice(
                    dayIndex * itemsPerDay,
                    (dayIndex + 1) * itemsPerDay
                );

                const updatedSlots = itinerary.timeSlots.map((slot, slotIndex) => {
                    // Map first N slots to the N activities for this day
                    if (slotIndex < dailyActivities.length) {
                        return {
                            ...slot,
                            activity: dailyActivities[slotIndex]
                        };
                    }
                    return slot;
                });

                const recalculatedSlots = recalculateTimeSlots(updatedSlots);
                return { ...itinerary, timeSlots: recalculatedSlots };
            });

            set({ dailyItineraries: updatedItineraries });
            get().saveToStorage();
        },

        selectActivity: (dayNumber, timeSlotId, activity) => {
            const { dailyItineraries } = get();
            const updatedItineraries = dailyItineraries.map((itinerary) => {
                if (itinerary.dayNumber === dayNumber) {
                    const updatedSlots = itinerary.timeSlots.map((slot) =>
                        slot.id === timeSlotId ? { ...slot, activity } : slot
                    );

                    // Recalculate all time slots after selection
                    const recalculatedSlots = recalculateTimeSlots(updatedSlots);

                    return { ...itinerary, timeSlots: recalculatedSlots };
                }
                return itinerary;
            });

            set({ dailyItineraries: updatedItineraries });
            get().saveToStorage();
        },

        removeActivity: (dayNumber, timeSlotId) => {
            const { dailyItineraries } = get();
            const updatedItineraries = dailyItineraries.map((itinerary) => {
                if (itinerary.dayNumber === dayNumber) {
                    const updatedSlots = itinerary.timeSlots.map((slot) =>
                        slot.id === timeSlotId ? { ...slot, activity: undefined } : slot
                    );

                    // Recalculate all time slots after removal
                    const recalculatedSlots = recalculateTimeSlots(updatedSlots);

                    return { ...itinerary, timeSlots: recalculatedSlots };
                }
                return itinerary;
            });

            set({ dailyItineraries: updatedItineraries });
            get().saveToStorage();
        },

        initializeDays: () => {
            const { numberOfDays, selectedRegion, startDate } = get();
            if (!selectedRegion) return;

            const itineraries: DayItinerary[] = [];
            for (let i = 1; i <= numberOfDays; i++) {
                let dateStr = undefined;
                if (startDate) {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + (i - 1));
                    dateStr = date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    });
                }

                itineraries.push({
                    dayNumber: i,
                    date: dateStr,
                    region: selectedRegion,
                    timeSlots: generateTimeSlots(),
                });
            }

            set({ dailyItineraries: itineraries, currentDay: 1 });
            get().saveToStorage();
        },

        autoPopulate: (activities) => {
            const { dailyItineraries } = get();

            // Simple auto-populate logic
            const updatedItineraries = dailyItineraries.map((itinerary) => {
                const slots = itinerary.timeSlots.map((slot, index) => {
                    // Get appropriate activities based on time of day
                    const hour = parseInt(slot.time.split(':')[0]);
                    let category: string[] = [];

                    if (hour >= 9 && hour < 10) category = ['breakfast', 'cafe'];
                    else if (hour >= 10 && hour < 12) category = ['temple', 'museum', 'attraction', 'culture'];
                    else if (hour >= 12 && hour < 14) category = ['lunch'];
                    else if (hour >= 14 && hour < 18) category = ['shopping', 'park', 'attraction'];
                    else if (hour >= 18 && hour < 20) category = ['dinner'];
                    else category = ['nightlife', 'cafe'];

                    // Find a random activity from the appropriate category
                    const suitableActivities = activities.filter((a) =>
                        category.includes(a.category) && a.regionId === itinerary.region.id
                    );

                    const randomActivity = suitableActivities[Math.floor(Math.random() * suitableActivities.length)];

                    if (randomActivity) {
                        // Assign a realistic random cost based on price level
                        // Level 1: $10-30, 2: $30-60, 3: $60-120, 4: $120-300
                        const baseCosts = [0, 15, 45, 90, 200];
                        const variation = Math.random() * 0.4 + 0.8; // 0.8x to 1.2x
                        const estimatedCost = Math.round(baseCosts[randomActivity.priceLevel] * variation);

                        return {
                            ...slot,
                            activity: { ...randomActivity, estimatedCost }
                        };
                    }
                    return slot;
                });

                // Recalculate times
                const recalculatedSlots = recalculateTimeSlots(slots);

                return { ...itinerary, timeSlots: recalculatedSlots };
            });

            set({ dailyItineraries: updatedItineraries });
            get().saveToStorage();
        },

        clearItinerary: () => {
            set({
                selectedCountry: null,
                selectedRegion: null,
                dailyItineraries: [],
                currentDay: 1,
                startDate: null,
                numberOfDays: 3,
                totalBudget: 0,
                selectedDestinations: [],
                optimizedRoute: [],
            });
            get().saveToStorage();
        },

        saveToStorage: () => {
            if (typeof window === 'undefined') return;
            try {
                const state = {
                    selectedCountry: get().selectedCountry,
                    selectedRegion: get().selectedRegion,
                    numberOfDays: get().numberOfDays,
                    dailyItineraries: get().dailyItineraries,
                    currentDay: get().currentDay,
                    startDate: get().startDate,
                    totalBudget: get().totalBudget,
                    currency: get().currency,
                    selectedDestinations: get().selectedDestinations,
                    optimizedRoute: get().optimizedRoute,
                };
                localStorage.setItem('ai-travel-planner-state', JSON.stringify(state));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },
    };
});
