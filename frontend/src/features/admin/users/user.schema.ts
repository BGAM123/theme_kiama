import { z } from 'zod';

export const createUserSchema = z.object({
    firstName: z.string().min(2, 'Le prénom est requis.'),
    lastName: z.string().min(2, 'Le nom est requis.'),
    email: z.string().email("Format d'email invalide."),
    role: z.enum(['ADMIN', 'USER'], { required_error: 'Sélectionnez un rôle.' }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
