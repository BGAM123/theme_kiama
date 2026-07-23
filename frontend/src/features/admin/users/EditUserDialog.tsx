import React from 'react';
import { useUpdateUser } from './useAdminUsers';
import { UserFormDialog } from './UserForm';
import { updateUserSchema } from './user.schema';
import { UserDTO } from '@/types/auth.types';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserDTO | null;
}

export function EditUserDialog({ open, onOpenChange, user }: EditUserDialogProps) {
  const { mutate, isPending } = useUpdateUser();

  const handleSubmit = (data: any) => {
    if (!user) return;
    
    mutate(
      {
        id: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <UserFormDialog
      open={open}
      onOpenChange={onOpenChange}
      mode="edit"
      initialData={user || {}}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      schema={updateUserSchema}
    />
  );
}
