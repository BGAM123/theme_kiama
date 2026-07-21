import { z } from 'zod';

export const chatPromptSchema = z.object({
    prompt: z.string().min(20, "Le prompt doit contenir au moins 20 caractères pour une génération adéquate.")
});

export type ChatPromptFormData = z.infer<typeof chatPromptSchema>;
