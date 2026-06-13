import { axiosClient } from '@shared/plugins/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { ClinicalEntryDataRequest } from '@/front_bff_shared/sample/diagnosis/record-management/clinical-entry/types/clinical-entry.api.request';
import { ClinicalEntryDataResponse } from '@/front_bff_shared/sample/diagnosis/record-management/clinical-entry/types/clinical-entry.api.response';

// ClinicalEntryDataResponseを再エクスポート（既存のコードとの互換性のため）
export type { ClinicalEntryDataResponse };

/**
 * 診療記録入力データの取得 Hook
 *
 * @param patientId - 患者ID
 */
export const useClinicalEntryData = (patientId: string | null) => {
  return useQuery({
    queryKey: ['clinicalEntryData', patientId],
    queryFn: async () => {
      if (!patientId) {
        throw new Error('患者IDが指定されていません');
      }

      console.log(`--- fetch実行: 患者ID ${patientId} の診療記録データを取得します ---`);

      const req: ClinicalEntryDataRequest = { patientId };
      const response = await axiosClient.post<ClinicalEntryDataResponse>(
        '/clinical/entry',
        req
      );
      return response.data;
    },
    enabled: !!patientId, // 患者IDが存在する場合のみ実行
    staleTime: 1000 * 60 * 5, // 5分
    refetchOnWindowFocus: false,
  });
};
