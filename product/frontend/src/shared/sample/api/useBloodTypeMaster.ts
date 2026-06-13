import { axiosClient } from '@shared/plugins/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { BloodTypeMasterResponse, BloodTypeOption } from '@/front_bff_shared/sample/master/types/blood-type-master.api.response';

// BloodTypeOptionを再エクスポート（既存のコードとの互換性のため）
export type { BloodTypeOption, BloodTypeMasterResponse };

/**
 * 血液型マスタ情報の取得 Hook
 */
export const useBloodTypeMaster = () => {
  return useQuery({
    queryKey: ['bloodTypeMaster'],
    queryFn: async () => {
      console.log('--- fetch実行: 血液型マスタデータを取得します ---');

      const response = await axiosClient.get<BloodTypeMasterResponse>('/clinical/master/blood-type');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1時間（マスタデータなので長めに設定）
    refetchOnWindowFocus: false,
  });
};
