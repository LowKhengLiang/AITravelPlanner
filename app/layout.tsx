import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI Travel Planner | Plan Your Perfect Trip",
    description: "Create personalized travel itineraries with AI-powered suggestions, interactive maps, and dynamic scheduling.",
    keywords: ["travel", "itinerary", "planner", "AI", "vacation", "trip"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
