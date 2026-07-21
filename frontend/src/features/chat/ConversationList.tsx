import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversations, useCreateConversation, useDeleteConversation } from './useConversations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Search, MessageSquare, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { formatRelative, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function ConversationList({ activeId }: { activeId?: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const navigate = useNavigate();

    const { data, isLoading } = useConversations();
    const createConv = useCreateConversation();
    const deleteConv = useDeleteConversation();

    const handleCreate = () => {
        createConv.mutate();
    };

    const filtered = data?.content.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];

    return (
        <div className="w-72 flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col h-full z-10 transition-all shadow-[1px_0_15px_rgba(0,0,0,0.03)]">
            <div className="p-4 border-b border-slate-200 bg-white shadow-sm space-y-4">
                <Button
                    onClick={handleCreate}
                    disabled={createConv.isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle conversation
                </Button>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-slate-100/50 border-transparent focus:bg-white transition-colors"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-3 rounded-lg"><Skeleton className="h-5 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></div>
                    ))
                ) : filtered.length === 0 ? (
                    <div className="text-center p-6 text-sm text-slate-500">Aucune conversation trouvée.</div>
                ) : (
                    filtered.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => navigate(`/chat/${conv.id}`)}
                            className={cn(
                                "group cursor-pointer p-3 rounded-xl transition-all border",
                                activeId === conv.id
                                    ? "bg-indigo-50 border-indigo-200 shadow-sm"
                                    : "border-transparent hover:bg-white hover:border-slate-200 hover:shadow-sm"
                            )}
                        >
                            <div className="flex justify-between items-start mb-1 gap-2">
                                <h4 className={cn("font-medium text-sm truncate", activeId === conv.id ? "text-indigo-900" : "text-slate-700")}>
                                    {conv.title}
                                </h4>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity -mr-1">
                                            <MoreVertical className="h-3 w-3 text-slate-400" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem className="cursor-pointer text-slate-700"><Edit2 className="h-4 w-4 mr-2" /> Renommer</DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                                            onClick={(e) => { e.stopPropagation(); setDeleteId(conv.id); }}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-white border-slate-200 text-slate-500 truncate max-w-[100px]">{conv.documentTypeName}</Badge>
                                <div className="text-[11px] text-slate-400 truncate ml-auto whitespace-nowrap">{formatRelative(conv.createdAt)}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(o) => (!o) && setDeleteId(null)}
                title="Supprimer la conversation"
                description="Cette action est irréversible. Toutes les données partagées ici seront perdues."
                onConfirm={() => {
                    if (deleteId) deleteConv.mutate(deleteId);
                    setDeleteId(null);
                }}
            />
        </div>
    );
}
