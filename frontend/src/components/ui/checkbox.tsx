import React from 'react';
import type { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, onChange, ...props }, ref) => (
        <input
            ref={ref}
            type="checkbox"
            className={className}
            onChange={(event) => {
                onCheckedChange?.(event.target.checked);
                onChange?.(event as any);
            }}
            {...props}
        />
    ),
);

Checkbox.displayName = 'Checkbox';
