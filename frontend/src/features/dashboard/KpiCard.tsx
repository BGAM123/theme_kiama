import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    loading?: boolean;
}

export function KpiCard({ title, value, icon: Icon, loading }: KpiCardProps) {
    return (
        <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500 whitespace-nowrap">{title}</p>
                    {loading ? (
                        <Skeleton className="h-8 w-20 mt-1" />
                    ) : (
                        <p className="text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight group-hover:text-indigo-600 transition-colors">
                            {value}
                        </p>
                    )}
                </div>
                <div className="bg-indigo-50/50 group-hover:bg-indigo-100 p-3.5 rounded-2xl transition-colors ring-1 ring-indigo-50">
                    <Icon className="h-6 w-6 text-indigo-600" />
                </div>
            </CardContent>
        </Card>
    );
}
