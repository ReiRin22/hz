import { axiosClient } from '@shared/plugins/axiosClient';
import { UserResponse } from '@/front_bff_shared/features/ui-common/menu-header/user-header/types/responses/user.response';
import { UserGetRequest } from '@/front_bff_shared/features/ui-common/menu-header/user-header/types/requests/user.request';

export const getUser = async (id: UserGetRequest['id']): Promise<UserResponse> => {
  const response = await axiosClient.get<UserResponse>(`/user/${id}`);
  return response.data;
};

export const updateUser = async (id: string, name: string) => {
    console.log(name)
  // ここで生のデータを送る。インターセプターがこれをキャッチする。
  return await axiosClient.post(`/user/${id}`, { name: name });
};