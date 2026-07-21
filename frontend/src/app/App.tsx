import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { router } from './router';
import { queryClient } from '@/lib/query-client';

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    classNames: {
                        toast: 'font-medium border border-slate-200/80 shadow-lg',
                        title: 'font-semibold text-slate-900',
                        description: 'text-slate-500',
                        actionButton: 'bg-indigo-600',
                        closeButton: 'bg-slate-100',
                    },
                }}
            />
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
