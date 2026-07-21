import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps {
    firstName?: string;
    lastName?: string;
    className?: string;
}

export function Avatar({ firstName = '', lastName = '', className }: AvatarProps) {
    const f = firstName.charAt(0);
    const l = lastName.charAt(0);
    const initials = (f || l) ? `${f}${l}`.toUpperCase() : '?';

    return (
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 select-none shadow-sm", className)}>
            {initials}
        </div>
    );
}
