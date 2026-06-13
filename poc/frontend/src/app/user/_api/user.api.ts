import { axiosClient } from '@shared/plugins/axios.client';
import { UserResponse } from '@/front_bff_shared/types/response/user.response.type';
import { UserGetRequest } from '@/front_bff_shared/types/request/user.request.type';

export const getUser = async (id: UserGetRequest['id']): Promise<UserResponse> => {
  const response = await axiosClient.get<UserResponse>(`/user/${id}`);
  return response.data;
};

export const updateUser = async (id: string, name: string) => {
    console.log(name)
  // ここで生のデータを送る。インターセプターがこれをキャッチする。
  return await axiosClient.post(`/user/${id}`, { name: name });
};