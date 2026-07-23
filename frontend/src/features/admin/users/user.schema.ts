import { z } from 'zod';

// Schéma pour la création d'un utilisateur
export const createUserSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' })
    .max(50, { message: 'Le prénom ne peut pas dépasser 50 caractères.' })
    .regex(/^[a-zA-Zà-üÀ-Ü\s'-]+$/, { 
      message: 'Le prénom ne peut contenir que des lettres, espaces, apostrophes ou tirets.' 
    }),
  lastName: z
    .string()
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères.' })
    .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères.' })
    .regex(/^[a-zA-Zà-üÀ-Ü\s'-]+$/, { 
      message: 'Le nom ne peut contenir que des lettres, espaces, apostrophes ou tirets.' 
    }),
  email: z
    .string()
    .email({ message: "L'email n'est pas valide." })
    .max(255, { message: "L'email ne peut pas dépasser 255 caractères." }),
  role: z.enum(['ADMIN', 'USER'], { 
    required_error: 'Le rôle est requis.',
    invalid_type_error: 'Le rôle doit être ADMIN ou USER.' 
  }),
  password: z
    .string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères.' })
    .max(100, { message: 'Le mot de passe ne peut pas dépasser 100 caractères.' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { 
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre.' 
    })
    .optional()
    .or(z.literal('')), // Accepte une chaîne vide (mot de passe généré automatiquement)
});

// Schéma pour la mise à jour d'un utilisateur
export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'Le prénom doit contenir au moins 2 caractères.' })
    .max(50, { message: 'Le prénom ne peut pas dépasser 50 caractères.' })
    .regex(/^[a-zA-Zà-üÀ-Ü\s'-]+$/, { 
      message: 'Le prénom ne peut contenir que des lettres, espaces, apostrophes ou tirets.' 
    })
    .optional(),
  lastName: z
    .string()
    .min(2, { message: 'Le nom doit contenir au moins 2 caractères.' })
    .max(50, { message: 'Le nom ne peut pas dépasser 50 caractères.' })
    .regex(/^[a-zA-Zà-üÀ-Ü\s'-]+$/, { 
      message: 'Le nom ne peut contenir que des lettres, espaces, apostrophes ou tirets.' 
    })
    .optional(),
  role: z.enum(['ADMIN', 'USER'], { 
    invalid_type_error: 'Le rôle doit être ADMIN ou USER.' 
  })
  .optional(),
});

// Types inferés à partir des schémas
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
