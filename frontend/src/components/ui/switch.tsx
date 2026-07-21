import React from 'react';
import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

export interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, onCheckedChange, onChange, ...props }, ref) => (
        <label className={cn('inline-flex items-center cursor-pointer', className)}>
            <input
                ref={ref}
                type="checkbox"
                className="sr-only"
                onChange={(event) => {
                    onCheckedChange?.(event.target.checked);
                    onChange?.(event as any);
                }}
                {...props}
            />
            <span className="h-5 w-10 rounded-full bg-slate-300 shadow-inner transition-colors" />
        </label>
    ),
);

Switch.displayName = 'Switch';
