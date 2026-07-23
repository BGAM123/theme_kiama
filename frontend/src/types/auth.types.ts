// ============================================
// Types pour l'authentification
// ============================================
export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================
// Types pour les utilisateurs (Admin)
// ============================================

// Statut possible d'un utilisateur
export type UserStatus = 'ACTIVE' | 'INACTIVE';

// Rôle possible d'un utilisateur
export type UserRole = 'ADMIN' | 'USER';

// Interface de base pour un utilisateur
export interface UserDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
}

// DTO pour créer un utilisateur (formulaire frontend)
export interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  password?: string; // Optionnel (généré automatiquement si non fourni)
}

// DTO pour mettre à jour un utilisateur
export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
}

// ============================================
// Types pour la pagination et les filtres
// ============================================

// Filtres pour la liste des utilisateurs
export interface UserFilters {
  page?: number;
  size?: number;
  search?: string; // Recherche par prénom, nom ou email
  role?: UserRole; // Filtre par rôle
  status?: UserStatus; // Filtre par statut
}

// Réponse paginée générique
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  last: boolean;
  first: boolean;
}

// Réponse paginée pour les utilisateurs
export interface PaginatedUsersResponse extends PaginatedResponse<UserDTO> {}

// ============================================
// Types pour les messages et feedback
// ============================================

// Type pour les messages de toast
export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}
