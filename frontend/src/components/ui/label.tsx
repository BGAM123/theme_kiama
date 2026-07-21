import React from 'react';
import type { LabelHTMLAttributes } from 'react';

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={['block text-sm font-medium text-slate-700', className].filter(Boolean).join(' ')}
            {...props}
        />
    ),
);

Label.displayName = 'Label';
