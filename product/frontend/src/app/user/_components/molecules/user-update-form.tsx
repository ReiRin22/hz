'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userUpdateSchema, UserUpdateInput } from '@/front_bff_shared/schemas/user.schema';

export const UserUpdateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<UserUpdateInput>({
    resolver: zodResolver(userUpdateSchema),
    mode: 'onChange' // 入力のたびにバリデーションを実行
  });

  const onSubmit = (data: UserUpdateInput) => {
    // バリデーション成功時のみ実行される
    console.log('✅ バリデーション通過・送信データ:', data);
    alert('バリデーションを通過しました。データを送信します。');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
      <h3 className="font-bold border-b pb-2">ユーザー情報編集（バリデーション検証）</h3>
      
      <div>
        <label className="block text-sm font-medium">名前 (2〜10文字)</label>
        <input 
          {...register('name')} 
          className={`border w-full p-2 rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">メールアドレス</label>
        <input 
          {...register('email')} 
          className={`border w-full p-2 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <button 
        type="submit"
        disabled={!isValid}
        className={`w-full p-2 rounded text-white ${isValid ? 'bg-blue-600' : 'bg-gray-400'}`}
      >
        バリデーションを確認
      </button>
    </form>
  );
};