import React from 'react';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
};

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-slate-100 text-slate-800',
    secondary: 'bg-indigo-100 text-indigo-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    outline: 'border border-slate-200 bg-white text-slate-700',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', ...props }, ref) => (
        <span
            ref={ref}
            className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', variantClasses[variant], className)}
            {...props}
        />
    ),
);

Badge.displayName = 'Badge';
