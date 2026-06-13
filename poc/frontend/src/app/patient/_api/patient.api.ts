import { axiosClient } from '@/app/_shared/plugins/axios.client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PatientResponse } from '@/front_bff_shared/types/response/patient.response.type';

/**
 * 患者詳細情報の取得 Hook
 */
export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      console.log(`--- fetch実行: Patient ID ${id} のデータを取得します ---`);
      const response = await axiosClient.get<PatientResponse>(`/patient/${id}`);
      return response.data;
    },
    enabled: !!id, // IDが存在する場合のみ実行
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

/**
 * 患者画像のアップロード Hook
 */
export const useUploadPatientImage = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      console.log(`--- 画像選択: Patient ID ${id} の画像ファイル "${file.name}" を選択しました ---`);

      console.log(`--- upload実行: Patient ID ${id} の画像を送信します ---`);
      const response = await axiosClient.post<{ imagePath: string }>(
        `/patient/${id}/photo`,
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      // アップロード成功後、キャッシュを無効化して最新データを再取得させる
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
      console.log('--- キャッシュ更新: 画像アップロード成功 ---');
    },
  });
};