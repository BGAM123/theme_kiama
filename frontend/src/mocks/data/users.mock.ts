import { UserDTO } from '../../types/auth.types';

export const mockUsers: UserDTO[] = [
    {
        id: 'usr_1',
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@entreprise.fr',
        role: 'ADMIN',
        status: 'ACTIVE',
        lastLoginAt: new Date(Date.now() - 3600000).toISOString(),
        createdAt: '2024-01-15T08:30:00Z',
    },
    {
        id: 'usr_2',
        firstName: 'Sophie',
        lastName: 'Martin',
        email: 'sophie.martin@entreprise.fr',
        role: 'USER',
        status: 'ACTIVE',
        lastLoginAt: new Date().toISOString(),
        createdAt: '2024-05-20T10:15:00Z',
    },
    {
        id: 'usr_3',
        firstName: 'Luc',
        lastName: 'Bernard',
        email: 'luc.bernard@entreprise.fr',
        role: 'USER',
        status: 'INACTIVE',
        lastLoginAt: null,
        createdAt: '2024-06-10T14:45:00Z',
    }
];
