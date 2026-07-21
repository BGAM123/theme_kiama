import React, { useState } from 'react';
import { useAdminRoles, useSavePermissions } from './useAdminRoles';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PermissionDTO } from '@/types/admin.types';

export function AdminRolesPage() {
    const { data, isLoading } = useAdminRoles();
    const { mutate: savePermissions, isPending } = useSavePermissions();
    const [localPerms, setLocalPerms] = useState<PermissionDTO[] | null>(null);

    const permissions = localPerms ?? data?.permissions ?? [];
    const roles = data?.roles ?? [];

    const togglePerm = (feature: string, roleId: string) => {
        const updated = permissions.map(p => {
            if (p.feature !== feature) return p;
            const has = p.roleIds.includes(roleId);
            return { ...p, roleIds: has ? p.roleIds.filter(r => r !== roleId) : [...p.roleIds, roleId] };
        });
        setLocalPerms(updated);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Rôles & Permissions"
                description="Définissez les droits d'accès par rôle sur l'ensemble des fonctionnalités."
                action={
                    <Button
                        onClick={() => savePermissions(permissions)}
                        disabled={isPending || isLoading}
                        className="bg-indigo-600 text-white shadow-md gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isPending ? 'Enregistrement...' : 'Enregistrer'}
                    </Button>
                }
            />

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="text-left px-6 py-4 font-semibold text-slate-600 w-[55%]">Fonctionnalité</th>
                            {isLoading ? (
                                <th><Skeleton className="h-5 w-24 mx-auto" /></th>
                            ) : (
                                roles.map(role => (
                                    <th key={role.id} className="text-center px-6 py-4 font-semibold text-slate-600 min-w-[120px]">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className={cn(
                                                "h-8 w-8 rounded-full flex items-center justify-center",
                                                role.name === 'ADMIN' ? "bg-indigo-50" : "bg-slate-100"
                                            )}>
                                                <Shield className={cn("h-4 w-4", role.name === 'ADMIN' ? "text-indigo-600" : "text-slate-500")} />
                                            </div>
                                            <span className="text-sm">{role.label}</span>
                                        </div>
                                    </th>
                                ))
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-64" /></td>
                                    <td className="text-center px-6 py-4"><Skeleton className="h-5 w-5 mx-auto rounded" /></td>
                                    <td className="text-center px-6 py-4"><Skeleton className="h-5 w-5 mx-auto rounded" /></td>
                                </tr>
                            ))
                        ) : (
                            permissions.map(perm => (
                                <tr key={perm.feature} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-800">{perm.feature}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{perm.description}</p>
                                    </td>
                                    {roles.map(role => {
                                        const isAdmin = role.name === 'ADMIN';
                                        const checked = perm.roleIds.includes(role.id);
                                        return (
                                            <td key={role.id} className="text-center px-6 py-4">
                                                <Checkbox
                                                    checked={checked}
                                                    disabled={isAdmin} // Admin always has all perms
                                                    onCheckedChange={() => togglePerm(perm.feature, role.id)}
                                                    className={cn(
                                                        "h-5 w-5 border-2 transition-colors",
                                                        isAdmin && checked ? 'border-indigo-300 data-[state=checked]:bg-indigo-100 data-[state=checked]:text-indigo-600 cursor-not-allowed' : ''
                                                    )}
                                                    aria-label={`${perm.feature} pour ${role.label}`}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
