import React from 'react';
import { useActivityLog } from './useActivityLog';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/shared/Avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Activity, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

const actionBadgeConfig: Record<string, string> = {
    'Génération': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Export': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Import': 'bg-cyan-100 text-cyan-700 border-cyan-200',
    'Création': 'bg-violet-100 text-violet-700 border-violet-200',
    'Modification': 'bg-amber-100 text-amber-700 border-amber-200',
    'Suppression': 'bg-red-100 text-red-700 border-red-200',
};

export function ActivityPage() {
    const { data, isLoading } = useActivityLog();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Journal d'activité"
                description="Traçabilité complète des événements et actions réalisées sur la plateforme."
                action={
                    <Button variant="outline" className="gap-2 border-slate-200 bg-white">
                        <Download className="h-4 w-4" />
                        Exporter CSV
                    </Button>
                }
            />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-600">Utilisateur</TableHead>
                            <TableHead className="font-semibold text-slate-600">Action</TableHead>
                            <TableHead className="font-semibold text-slate-600">Entité</TableHead>
                            <TableHead className="font-semibold text-slate-600">Détail</TableHead>
                            <TableHead className="font-semibold text-slate-600">Date</TableHead>
                            <TableHead className="font-semibold text-slate-600">IP</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-28" /></div></TableCell>
                                    {Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
                                </TableRow>
                            ))
                        ) : !data?.content.length ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-52">
                                    <EmptyState icon={Activity} title="Aucune activité" description="Aucun événement enregistré." className="border-0 bg-transparent" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.content.map(log => {
                                const [firstName = '', lastName = ''] = log.userName.split(' ');
                                return (
                                    <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-2.5">
                                                <Avatar firstName={firstName} lastName={lastName} className="h-8 w-8 text-xs shrink-0" />
                                                <span className="font-semibold text-slate-800 text-sm">{log.userName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'text-xs font-semibold border',
                                                    actionBadgeConfig[log.action] || 'bg-slate-100 text-slate-600 border-slate-200'
                                                )}
                                            >
                                                {log.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{log.entityLabel}</p>
                                                <p className="text-xs text-slate-400">{log.entityType}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm max-w-[200px] truncate">{log.detail}</TableCell>
                                        <TableCell className="text-slate-500 text-sm whitespace-nowrap">{formatDate(log.createdAt)}</TableCell>
                                        <TableCell>
                                            <code className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{log.ipAddress}</code>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
