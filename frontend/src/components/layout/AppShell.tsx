import React from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
            <Sidebar />
            <main className="flex-1 overflow-y-auto w-full relative">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full h-full min-h-full">
                    {children}
                </div>
            </main>
            {/* Toaster from Sonner would normally be mounted universally in main.tsx or here */}
        </div>
    );
}
