'use client';

import { Share2 } from 'lucide-react';
import Link from 'next/link';

export default function PublishButton() {
    return (
        <Link href="/community/create">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition-all text-sm font-medium">
                <Share2 className="w-4 h-4" />
                Publish Trip
            </button>
        </Link>
    );
}
