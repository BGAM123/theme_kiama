import React from 'react';
import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const base = 'min-w-full divide-y divide-slate-200 text-sm text-slate-900';

export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
    ({ className, ...props }, ref) => (
        <table ref={ref} className={cn(base, className)} {...props} />
    ),
);
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <thead ref={ref} className={cn('bg-slate-50', className)} {...props} />
    ),
);
TableHeader.displayName = 'TableHeader';
export const TableHead = TableHeader;

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
    ({ className, ...props }, ref) => (
        <tbody ref={ref} className={cn('divide-y divide-slate-200', className)} {...props} />
    ),
);
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
    ({ className, ...props }, ref) => (
        <tr ref={ref} className={cn('even:bg-slate-50', className)} {...props} />
    ),
);
TableRow.displayName = 'TableRow';

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
        <td ref={ref} className={cn('px-3 py-2 align-middle', className)} {...props} />
    ),
);
TableCell.displayName = 'TableCell';
