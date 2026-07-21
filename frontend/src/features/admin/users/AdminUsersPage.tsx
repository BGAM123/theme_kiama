import React, { useState } from 'react';
import { useAdminUsers, useToggleUserStatus, useDeleteUser } from './useAdminUsers';
import { CreateUserDialog } from './CreateUserDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Avatar } from '@/components/shared/Avatar';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { UserPlus, Trash2, ShieldCheck, User } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export function AdminUsersPage() {
    const [showCreate, setShowCreate] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data, isLoading } = useAdminUsers();
    const toggleStatus = useToggleUserStatus();
    const deleteUser = useDeleteUser();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Gestion des utilisateurs"
                description="Administrez les comptes et leur accès à la plateforme."
                action={
                    <Button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md gap-2">
                        <UserPlus className="h-4 w-4" />
                        Créer un compte
                    </Button>
                }
            />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="font-semibold text-slate-600">Utilisateur</TableHead>
                            <TableHead className="font-semibold text-slate-600">Email</TableHead>
                            <TableHead className="font-semibold text-slate-600">Rôle</TableHead>
                            <TableHead className="font-semibold text-slate-600">Statut</TableHead>
                            <TableHead className="font-semibold text-slate-600">Dernière connexion</TableHead>
                            <TableHead className="font-semibold text-slate-600">Actif</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-5 w-28" /></div></TableCell>
                                    {Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                                </TableRow>
                            ))
                        ) : (
                            data?.content.map(user => (
                                <TableRow key={user.id} className="hover:bg-slate-50/60 transition-colors">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar firstName={user.firstName} lastName={user.lastName} />
                                            <span className="font-semibold text-slate-900">{user.firstName} {user.lastName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm">{user.email}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={user.role === 'ADMIN'
                                                ? 'border-indigo-200 bg-indigo-50 text-indigo-700 gap-1 font-semibold'
                                                : 'border-slate-200 bg-slate-50 text-slate-600 gap-1 font-semibold'}
                                        >
                                            {user.role === 'ADMIN'
                                                ? <><ShieldCheck className="h-3 w-3" /> Admin</>
                                                : <><User className="h-3 w-3" /> Utilisateur</>
                                            }
                                        </Badge>
                                    </TableCell>
                                    <TableCell><StatusBadge status={user.status} /></TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {user.lastLoginAt ? formatDate(user.lastLoginAt) : <span className="text-slate-300 italic">Jamais connecté</span>}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={user.status === 'ACTIVE'}
                                            onCheckedChange={(checked) => toggleStatus.mutate({ id: user.id, active: checked })}
                                            disabled={toggleStatus.isPending}
                                            aria-label={`Basculer statut de ${user.firstName}`}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                            onClick={() => setDeleteId(user.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreateUserDialog open={showCreate} onOpenChange={setShowCreate} />
            <ConfirmDialog
                open={!!deleteId}
                onOpenChange={o => !o && setDeleteId(null)}
                title="Supprimer cet utilisateur ?"
                description="Son compte et toutes ses données d'activité seront définitivement supprimés."
                confirmText="Supprimer"
                onConfirm={() => { if (deleteId) deleteUser.mutate(deleteId); setDeleteId(null); }}
                isLoading={deleteUser.isPending}
            />
        </div>
    );
}
