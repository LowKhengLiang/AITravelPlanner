import { ReactNode } from 'react';

// Required for static export (output: 'export') with dynamic routes
export function generateStaticParams() {
    return [
        { id: 'p1' },
        { id: 'p2' }
    ];
}

export default function PostLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
