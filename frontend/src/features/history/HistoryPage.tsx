import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHistory } from './useHistory';
import { useConversations } from '@/features/chat/useConversations';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Search, MessageSquare, FileEdit, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function HistoryPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const { data, isLoading } = useHistory({ search });

    // Reuse conversations as history (same DTO shape, mocked at /api/conversations)
    const { data: convData, isLoading: convLoading } = useConversations();
    const historyItems = convData?.content || [];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Historique des conversations"
                description="Retrouvez toutes vos sessions de génération passées."
            />

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex gap-4 flex-wrap items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par titre..."
                        className="pl-9"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-600">Titre</TableHead>
                            <TableHead className="font-semibold text-slate-600">Document Type</TableHead>
                            <TableHead className="font-semibold text-slate-600">Modèle</TableHead>
                            <TableHead className="font-semibold text-slate-600">Langue</TableHead>
                            <TableHead className="font-semibold text-slate-600">Statut</TableHead>
                            <TableHead className="font-semibold text-slate-600">Date</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {convLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : historyItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64">
                                    <EmptyState
                                        icon={History}
                                        title="Aucun historique"
                                        description="Vous n'avez pas encore généré de documents."
                                        action={<Button onClick={() => navigate('/chat')}>Démarrer une génération</Button>}
                                        className="border-0 bg-transparent"
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            historyItems.map(conv => (
                                <TableRow key={conv.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium text-slate-900">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-indigo-400 shrink-0" />
                                            {conv.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-xs text-slate-600 border-slate-200 bg-slate-50">
                                            {conv.documentTypeName}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm">{conv.modelName}</TableCell>
                                    <TableCell className="text-slate-600 text-sm">{conv.language}</TableCell>
                                    <TableCell><StatusBadge status={conv.status} /></TableCell>
                                    <TableCell className="text-slate-500 text-sm whitespace-nowrap">{formatDate(conv.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                onClick={() => navigate(`/chat/${conv.id}`)}
                                                title="Ouvrir le chat"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                                title="Ouvrir l'éditeur"
                                            >
                                                <FileEdit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
