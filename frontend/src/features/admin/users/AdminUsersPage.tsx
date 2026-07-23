import React, { useState } from 'react';
import { 
  useAdminUsers, 
  useToggleUserStatus, 
  useDeleteUser 
} from './useAdminUsers';
import { CreateUserDialog } from './CreateUserDialog';
import { EditUserDialog } from './EditUserDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Avatar } from '@/components/shared/Avatar';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  User as UserIcon,
  Pencil,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { UserDTO, UserRole, UserStatus } from '@/types/auth.types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Composant pour les filtres
export function UsersFilters({ 
  search, 
  role, 
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  isLoading
}: {
  search: string;
  role: UserRole | '';
  status: UserStatus | '';
  onSearchChange: (value: string) => void;
  onRoleChange: (value: UserRole | '') => void;
  onStatusChange: (value: UserStatus | '') => void;
  isLoading: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-slate-50"
            disabled={isLoading}
          />
        </div>

        {/* Filtre par rôle */}
        <Select 
          value={role}
          onValueChange={onRoleChange}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-slate-50">
            <SelectValue placeholder="Tous les rôles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les rôles</SelectItem>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
            <SelectItem value="USER">Utilisateur</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtre par statut */}
        <Select 
          value={status}
          onValueChange={onStatusChange}
          disabled={isLoading}
        >
          <SelectTrigger className="bg-slate-50">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous les statuts</SelectItem>
            <SelectItem value="ACTIVE">Actif</SelectItem>
            <SelectItem value="INACTIVE">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Composant pour la pagination
export function UsersPagination({ 
  currentPage,
  totalPages,
  onPageChange,
  isLoading
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0 || isLoading}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm text-slate-600">
          Page {currentPage + 1} sur {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1 || isLoading}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Composant pour une ligne d'utilisateur
export function UserRow({ 
  user,
  onEdit,
  onToggleStatus,
  onDelete,
  toggleStatusLoading
}: {
  user: UserDTO;
  onEdit: (user: UserDTO) => void;
  onToggleStatus: (user: UserDTO, active: boolean) => void;
  onDelete: (user: UserDTO) => void;
  toggleStatusLoading: boolean;
}) {
  return (
    <TableRow key={user.id} className="hover:bg-slate-50/60 transition-colors">
      {/* Utilisateur */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar firstName={user.firstName} lastName={user.lastName} />
          <div>
            <span className="font-semibold text-slate-900">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Email */}
      <TableCell className="text-slate-600 text-sm">
        {user.email}
      </TableCell>

      {/* Rôle */}
      <TableCell>
        <Badge
          variant="outline"
          className={`gap-1 font-semibold ${
            user.role === 'ADMIN'
              ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
              : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}
        >
          {user.role === 'ADMIN' ? (
            <><ShieldCheck className="h-3 w-3" /> Admin</>
          ) : (
            <><UserIcon className="h-3 w-3" /> Utilisateur</>
          )}
        </Badge>
      </TableCell>

      {/* Statut */}
      <TableCell>
        <StatusBadge status={user.status} />
      </TableCell>

      {/* Dernière connexion */}
      <TableCell className="text-slate-500 text-sm">
        {user.lastLoginAt ? formatDate(user.lastLoginAt) : (
          <span className="text-slate-300 italic">Jamais connecté</span>
        )}
      </TableCell>

      {/* Actif */}
      <TableCell>
        <Switch
          checked={user.status === 'ACTIVE'}
          onCheckedChange={(checked) => onToggleStatus(user, checked)}
          disabled={toggleStatusLoading}
          aria-label={`Basculer statut de ${user.firstName}`}
        />
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={() => onEdit(user)}
            title="Modifier"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={() => onDelete(user)}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Composant pour le tableau des utilisateurs
export function UsersTable({ 
  users,
  isLoading,
  onEdit,
  onToggleStatus,
  onDelete,
  toggleStatusLoading
}: {
  users: UserDTO[] | undefined;
  isLoading: boolean;
  onEdit: (user: UserDTO) => void;
  onToggleStatus: (user: UserDTO, active: boolean) => void;
  onDelete: (user: UserDTO) => void;
  toggleStatusLoading: boolean;
}) {
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <Skeleton className="h-5 w-28" />
              </div>
            </TableCell>
            <TableCell><Skeleton className="h-5 w-full" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-5 w-16" /></TableCell>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-12" /></TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  if (!users || users.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8">
            <div className="flex flex-col items-center gap-4">
              <UserIcon className="h-12 w-12 text-slate-300" />
              <p className="text-slate-400">Aucun utilisateur trouvé.</p>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          onEdit={onEdit}
          onToggleStatus={onToggleStatus}
          onDelete={onDelete}
          toggleStatusLoading={toggleStatusLoading}
        />
      ))}
    </TableBody>
  );
}

// Page principale
export function AdminUsersPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [deleteUserData, setDeleteUserData] = useState<UserDTO | null>(null);
  const [filters, setFilters] = useState({
    page: 0,
    size: 10,
    search: '',
    role: '' as UserRole | '',
    status: '' as UserStatus | '',
  });

  const { 
    data, 
    isLoading, 
    isFetching 
  } = useAdminUsers(filters);
  const toggleStatus = useToggleUserStatus();
  const deleteUser = useDeleteUser();

  // Gestion des filtres
  const handleSearchChange = (value: string) => {
    setFilters({ ...filters, search: value, page: 0 }); // Réinitialiser à la page 0
  };

  const handleRoleChange = (value: UserRole | '') => {
    setFilters({ ...filters, role: value, page: 0 });
  };

  const handleStatusChange = (value: UserStatus | '') => {
    setFilters({ ...filters, status: value, page: 0 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  // Gestion des actions
  const handleEdit = (user: UserDTO) => {
    setEditingUser(user);
  };

  const handleToggleStatus = (user: UserDTO, active: boolean) => {
    toggleStatus.mutate({ id: user.id, active });
  };

  const handleDelete = (user: UserDTO) => {
    setDeleteUserData(user);
  };

  const confirmDelete = () => {
    if (deleteUserData) {
      deleteUser.mutate(deleteUserData.id, {
        onSuccess: () => {
          setDeleteUserData(null);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <PageHeader
        title="Gestion des utilisateurs"
        description="Administrez les comptes et leur accès à la plateforme."
        action={
          <Button 
            onClick={() => setShowCreate(true)} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Créer un compte
          </Button>
        }
      />

      {/* Filtres */}
      <UsersFilters
        search={filters.search}
        role={filters.role}
        status={filters.status}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
        isLoading={isLoading}
      />

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-600">Utilisateur</TableHead>
              <TableHead className="font-semibold text-slate-600">Email</TableHead>
              <TableHead className="font-semibold text-slate-600">Rôle</TableHead>
              <TableHead className="font-semibold text-slate-600">Statut</TableHead>
              <TableHead className="font-semibold text-slate-600">Dernière connexion</TableHead>
              <TableHead className="font-semibold text-slate-600 text-center">Actif</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <UsersTable
            users={data?.content}
            isLoading={isLoading}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            onDelete={handleDelete}
            toggleStatusLoading={toggleStatus.isPending}
          />
        </Table>
      </div>

      {/* Pagination */}
      <UsersPagination
        currentPage={filters.page}
        totalPages={data?.totalPages || 0}
        onPageChange={handlePageChange}
        isLoading={isLoading || isFetching}
      />

      {/* Dialogues */}
      <CreateUserDialog 
        open={showCreate} 
        onOpenChange={setShowCreate} 
      />
      
      <EditUserDialog
        open={!!editingUser}
        onOpenChange={() => setEditingUser(null)}
        user={editingUser}
      />

      {/* Confirmation de suppression */}
      <ConfirmDialog
        open={!!deleteUserData}
        onOpenChange={() => setDeleteUserData(null)}
        title="Supprimer cet utilisateur ?"
        description={
          deleteUserData 
            ? `Souhaitez-vous vraiment supprimer ${deleteUserData.firstName} ${deleteUserData.lastName} (${deleteUserData.email}) ? Cette action est irréversible.`
            : ''
        }
        confirmText="Supprimer"
        onConfirm={confirmDelete}
        isLoading={deleteUser.isPending}
        
      />

      {/* Indicateur de chargement global */}
      {(isLoading || isFetching) && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Chargement...</span>
          </div>
        </div>
      )}
    </div>
  );
}

