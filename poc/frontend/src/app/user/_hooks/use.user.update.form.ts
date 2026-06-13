import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userUpdateSchema, UserUpdateInput } from '@/front_bff_shared/schemas/user.schema';

export const useUserUpdateForm = (defaultValues: UserUpdateInput) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    reset
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues,
    mode: 'onChange', // リアルタイムな状態管理のため
  });

  return {
    register,
    handleSubmit,
    errors,
    isDirty,
    isValid,
    reset
  };
};