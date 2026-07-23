import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Eye, EyeOff, UserPlus, Pencil } from 'lucide-react';
import { UserDTO, UserRole } from '@/types/auth.types';

// Props pour le formulaire
interface UserFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<UserDTO>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  form: UseFormReturn<any>;
}

// Icône à afficher en fonction du mode
const getFormIcon = (mode: 'create' | 'edit') => {
  return mode === 'create' ? (
    <UserPlus className="h-5 w-5 text-indigo-600" />
  ) : (
    <Pencil className="h-5 w-5 text-indigo-600" />
  );
};

// Titre du formulaire en fonction du mode
const getFormTitle = (mode: 'create' | 'edit', firstName?: string, lastName?: string) => {
  if (mode === 'create') return 'Créer un compte';
  return `Modifier ${firstName || ''} ${lastName || ''}`.trim();
};

// Description du formulaire en fonction du mode
const getFormDescription = (mode: 'create' | 'edit') => {
  if (mode === 'create') {
    return 'Remplissez les informations pour créer un nouvel utilisateur.';
  }
  return 'Modifiez les informations de l\'utilisateur.';
};

// Texte du bouton en fonction du mode
const getSubmitText = (mode: 'create' | 'edit', isSubmitting: boolean) => {
  if (isSubmitting) return mode === 'create' ? 'Création...' : 'Sauvegarde...';
  return mode === 'create' ? 'Créer le compte' : 'Sauvegarder';
};

export function UserForm({ 
  mode, 
  initialData = {}, 
  onSubmit, 
  isSubmitting,
  form 
}: UserFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Prénom et Nom */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Prénom</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-slate-50"
                    placeholder="Jean"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Nom</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    className="bg-slate-50"
                    placeholder="Dupont"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Adresse e-mail</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="email"
                  className="bg-slate-50"
                  placeholder="jean.dupont@example.com"
                  disabled={isSubmitting || mode === 'edit'} // Email non modifiable en édition
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mot de passe (uniquement en mode création) */}
        {mode === 'create' && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mot de passe {(field.value === '' || !field.value) && (
                    <span className="text-sm text-slate-400">(optionnel, généré automatiquement)</span>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      type={showPassword ? 'text' : 'password'} 
                      className="bg-slate-50 pr-10"
                      placeholder="Min. 8 caractères (majuscule, minuscule, chiffre)"
                      disabled={isSubmitting}
                    />
                    {field.value && field.value.length > 0 && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Rôle */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Rôle</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="bg-slate-50">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">Utilisateur</SelectItem>
                  <SelectItem value="ADMIN">Administrateur</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Boutons */}
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            disabled={isSubmitting}
            className="flex-1"
            onClick={() => form.reset()}
          >
            Réinitialiser
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
          >
            {getSubmitText(mode, isSubmitting)}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Props pour le dialogue de formulaire
interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  initialData?: Partial<UserDTO>;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  schema: z.ZodSchema<any>;
}

// Dialogue contenant le formulaire
export function UserFormDialog({ 
  open, 
  onOpenChange, 
  mode, 
  initialData = {}, 
  onSubmit,
  isSubmitting,
  schema 
}: UserFormDialogProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      role: initialData.role || 'USER',
      password: '',
    },
  });

  // Réinitialiser le formulaire lors de la fermeture
  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  // Mettre à jour les valeurs initiales si initialData change
  React.useEffect(() => {
    if (open && initialData) {
      form.reset({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        role: initialData.role || 'USER',
        password: '',
      });
    }
  }, [open, initialData, form]);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {getFormIcon(mode)}
            {getFormTitle(mode, initialData.firstName, initialData.lastName)}
          </DialogTitle>
          <DialogDescription>
            {getFormDescription(mode)}
          </DialogDescription>
        </DialogHeader>
        
        <UserForm
          mode={mode}
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          form={form}
        />
      </DialogContent>
    </Dialog>
  );
}

// Import Dialog components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
