import React from 'react';
import { cn } from '@/lib/utils';

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
    <div className="relative inline-block text-left">{children}</div>
);

export interface DropdownMenuTriggerProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
    className?: string;
    asChild?: boolean;
}

export const DropdownMenuTrigger = ({ children, onClick, className, asChild }: DropdownMenuTriggerProps) => {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            className: [className, (children.props as any).className].filter(Boolean).join(' '),
            onClick,
        });
    }

    return (
        <button type="button" onClick={onClick} className={className ?? 'inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none'}>
            {children}
        </button>
    );
};

export interface DropdownMenuContentProps {
    children: React.ReactNode;
    className?: string;
    align?: 'start' | 'end';
}

export const DropdownMenuContent = ({ children, className, align = 'end' }: DropdownMenuContentProps) => (
    <div className={['absolute mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg', className, align === 'end' ? 'right-0' : 'left-0'].filter(Boolean).join(' ')}>
        {children}
    </div>
);

export interface DropdownMenuItemProps {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler;
    className?: string;
}

export const DropdownMenuItem = ({ children, onClick, className }: DropdownMenuItemProps) => (
    <button type="button" onClick={onClick} className={['w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100', className].filter(Boolean).join(' ')}>
        {children}
    </button>
);
