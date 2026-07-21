import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    value?: string;
    onValueChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, value, onValueChange, children, ...props }, ref) => (
        <select
            ref={ref}
            value={value}
            onChange={(event) => {
                onValueChange?.(event.target.value);
                props.onChange?.(event as any);
            }}
            className={cn(
                'w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100',
                className,
            )}
            {...props}
        >
            {children}
        </select>
    ),
);
Select.displayName = 'Select';

export interface SelectTriggerProps {
    children: React.ReactNode;
    className?: string;
    asChild?: boolean;
    onClick?: React.MouseEventHandler;
}

export const SelectTrigger = ({ children, className, asChild, onClick }: SelectTriggerProps) => {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            className: [className, (children.props as any).className].filter(Boolean).join(' '),
            onClick,
        });
    }

    return <div className={className} onClick={onClick}>{children}</div>;
};

export interface SelectValueProps {
    children?: React.ReactNode;
    placeholder?: string;
    className?: string;
}

export const SelectValue = ({ children, placeholder, className }: SelectValueProps) => (
    <span className={className}>{children ?? placeholder}</span>
);

export interface SelectContentProps {
    children: React.ReactNode;
    className?: string;
}

export const SelectContent = ({ children, className }: SelectContentProps) => (
    <div className={className}>{children}</div>
);

export interface SelectItemProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export const SelectItem = ({ value, children, className }: SelectItemProps) => (
    <option className={className} value={value}>{children}</option>
);
