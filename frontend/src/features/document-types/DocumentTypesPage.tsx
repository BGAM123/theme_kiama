import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTypes, useDeleteDocumentType } from './useDocumentTypes';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { FileUp, FileText, Search, MoreHorizontal, Eye, Edit, Trash2, Archive } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DocumentTypesPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading } = useDocumentTypes({
        search: searchTerm,
        status: statusFilter
    });

    const deleteMutation = useDeleteDocumentType();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Documents Types"
                description="Gérez les modèles de documents et leur structure sémantique."
                action={
                    <Button onClick={() => navigate('/document-types/new')} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        <FileUp className="mr-2 h-4 w-4" />
                        Importer un modèle
                    </Button>
                }
            />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <Tabs defaultValue="" onValueChange={setStatusFilter} className="w-full sm:w-auto overflow-x-auto">
                    <TabsList className="bg-slate-100/50 hidden sm:flex">
                        <TabsTrigger value="">Tous</TabsTrigger>
                        <TabsTrigger value="ACTIVE">Actifs</TabsTrigger>
                        <TabsTrigger value="EXTRACTED">Extraits</TabsTrigger>
                        <TabsTrigger value="ARCHIVED">Archivés</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="relative w-full sm:w-72 mt-4 sm:mt-0">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher par nom..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-600">Nom</TableHead>
                            <TableHead className="font-semibold text-slate-600">Catégorie</TableHead>
                            <TableHead className="font-semibold text-slate-600">Statut</TableHead>
                            <TableHead className="font-semibold text-slate-600">Sections</TableHead>
                            <TableHead className="font-semibold text-slate-600">Générations</TableHead>
                            <TableHead className="font-semibold text-slate-600 whitespace-nowrap">Mis à jour</TableHead>
                            <TableHead className="text-right w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : data?.content && data.content.length > 0 ? (
                            data.content.map((doc) => (
                                <TableRow key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-medium text-slate-900">{doc.name}</TableCell>
                                    <TableCell className="text-slate-600">{doc.categoryName}</TableCell>
                                    <TableCell><StatusBadge status={doc.status} /></TableCell>
                                    <TableCell className="text-slate-600">{doc.sectionsCount}</TableCell>
                                    <TableCell className="text-slate-600">{doc.documentsCount}</TableCell>
                                    <TableCell className="text-slate-500 text-sm">{formatDate(doc.updatedAt)}</TableCell>
                                    <TableCell className="text-right whitespace-nowrap">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/document-types/${doc.id}/structure`)}>
                                                    <Eye className="mr-2 h-4 w-4" /> Prévisualiser structure
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" /> Modifier infos
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-amber-600 focus:text-amber-700">
                                                    <Archive className="mr-2 h-4 w-4" /> Archiver
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600 focus:text-red-700" onClick={() => setDeleteId(doc.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-64">
                                    <EmptyState
                                        icon={FileText}
                                        title="Aucun Document Type trouvé"
                                        description={searchTerm ? "Modifiez vos filtres de recherche." : "Vous n'avez pas encore importé de modèle documentaire."}
                                        action={!searchTerm && <Button onClick={() => navigate('/document-types/new')} className="mt-4"><FileUp className="mr-2 h-4 w-4" /> Importer le premier</Button>}
                                        className="border-0 bg-transparent"
                                    />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={(o) => !o && setDeleteId(null)}
                title="Supprimer ce Document Type ?"
                description="Cette action est irréversible. Toutes les générations associées pourraient perdre leur référence structurelle."
                onConfirm={() => {
                    if (deleteId) deleteMutation.mutate(deleteId);
                    setDeleteId(null);
                }}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
