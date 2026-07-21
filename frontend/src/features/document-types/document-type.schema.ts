import { z } from 'zod';

export const documentTypeSchema = z.object({
    name: z.string().min(3, "Le nom doit comporter au moins 3 caractères."),
    categoryId: z.string().min(1, "Veuillez sélectionner une catégorie."),
    description: z.string().optional()
});

export type DocumentTypeFormData = z.infer<typeof documentTypeSchema>;
