import React, { useState } from 'react';
import { useNotifications, useMarkAllRead } from './useNotifications';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { formatRelative, cn } from '@/lib/utils';

const typeConfig = {
    INFO: { icon: Info, className: 'bg-blue-50 text-blue-600' },
    SUCCESS: { icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-600' },
    WARNING: { icon: AlertTriangle, className: 'bg-amber-50 text-amber-600' },
    ERROR: { icon: XCircle, className: 'bg-red-50 text-red-600' },
};

export function NotificationsPage() {
    const [unreadOnly, setUnreadOnly] = useState(false);
    const { data, isLoading } = useNotifications(unreadOnly);
    const { mutate: markAllRead, isPending } = useMarkAllRead();

    const unreadCount = data?.content.filter(n => !n.isRead).length ?? 0;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <PageHeader
                title="Notifications"
                description="Vos alertes système et événements récents."
                action={
                    <Button
                        variant="outline"
                        onClick={() => markAllRead()}
                        disabled={isPending || unreadCount === 0}
                        className="gap-2 border-slate-200 bg-white"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Tout marquer comme lu
                    </Button>
                }
            />

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-1 flex gap-1 w-fit">
                <button
                    onClick={() => setUnreadOnly(false)}
                    className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors", !unreadOnly ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
                >
                    Toutes
                </button>
                <button
                    onClick={() => setUnreadOnly(true)}
                    className={cn("px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors", unreadOnly ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
                >
                    Non lues
                    {unreadCount > 0 && (
                        <Badge className="h-5 px-1.5 text-[10px] bg-indigo-100 text-indigo-800 hover:bg-indigo-100">{unreadCount}</Badge>
                    )}
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-5 flex gap-4">
                            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-5 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/3" />
                            </div>
                        </div>
                    ))
                ) : data?.content.length === 0 ? (
                    <div className="py-16 flex flex-col items-center text-center text-slate-500">
                        <Bell className="h-12 w-12 mb-4 text-slate-300" />
                        <p className="font-semibold text-slate-700">Aucune notification</p>
                        <p className="text-sm mt-1">Vous êtes à jour !</p>
                    </div>
                ) : (
                    data?.content.map(notif => {
                        const cfg = typeConfig[notif.type];
                        const Icon = cfg.icon;
                        return (
                            <div
                                key={notif.id}
                                className={cn(
                                    "p-5 flex gap-4 items-start transition-colors cursor-pointer group",
                                    !notif.isRead ? "bg-indigo-50/30 hover:bg-indigo-50/60" : "hover:bg-slate-50/80"
                                )}
                            >
                                <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0 shadow-sm", cfg.className)}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-1">
                                        <p className={cn("text-sm", notif.isRead ? "font-medium text-slate-700" : "font-bold text-slate-900")}>
                                            {notif.title}
                                        </p>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {!notif.isRead && (
                                                <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
                                            )}
                                            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                                {formatRelative(notif.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500">{notif.body}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
