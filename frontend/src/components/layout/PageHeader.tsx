import React from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 animate-in slide-in-from-top-4 duration-300">
            <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 truncate">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 flex items-center text-sm text-slate-500 max-w-2xl">
                        {description}
                    </p>
                )}
            </div>
            {action && (
                <div className="mt-4 sm:ml-4 sm:mt-0 flex gap-3 shrink-0">
                    {action}
                </div>
            )}
        </div>
    );
}
