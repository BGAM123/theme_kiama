import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: 'Actif', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
    EXTRACTING: { label: 'En extraction', className: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
    EXTRACTED: { label: 'Structure extraite', className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
    ARCHIVED: { label: 'Archivé', className: 'bg-slate-100 text-slate-800 hover:bg-slate-200' },
    INACTIVE: { label: 'Inactif', className: 'bg-slate-100 text-slate-800 hover:bg-slate-200' },
    IMPORTED: { label: 'Importé', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
    PENDING: { label: 'En attente', className: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
    RUNNING: { label: 'En cours', className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200' },
    COMPLETED: { label: 'Terminé', className: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
    FAILED: { label: 'Échec', className: 'bg-red-100 text-red-800 hover:bg-red-200' }
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
    return (
        <Badge variant="outline" className={cn('border-0 font-medium whitespace-nowrap transition-colors', config.className, className)}>
            {config.label}
        </Badge>
    );
}
