import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center animate-in fade-in-50", className)}>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 mb-5 shadow-sm">
                <Icon className="h-7 w-7 text-indigo-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mb-6 text-sm text-slate-500 max-w-sm">{description}</p>
            {action && <div>{action}</div>}
        </div>
    );
}
