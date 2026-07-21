import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className, value = 0, ...props }, ref) => (
        <div ref={ref} className={cn('w-full rounded-full bg-slate-200 overflow-hidden', className)} {...props}>
            <div className="h-2 bg-indigo-600 transition-all" style={{ width: `${value}%` }} />
        </div>
    ),
);

Progress.displayName = 'Progress';
