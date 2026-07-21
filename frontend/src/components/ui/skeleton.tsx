import React from 'react';
import type { HTMLAttributes } from 'react';

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={['animate-pulse rounded-md bg-slate-200', className].filter(Boolean).join(' ')}
            {...props}
        />
    ),
);
Skeleton.displayName = 'Skeleton';
