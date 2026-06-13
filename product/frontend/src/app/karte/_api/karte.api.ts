import { axiosClient } from '@/app/_shared/plugins/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { KarteResponse } from '@/front_bff_shared/features/karte-core/karte/karte/types/responses/karte.response';

export const useKarte = () => {
  return useQuery({
    queryKey: ['karte'],
    queryFn: async () => {
      // 検証用ログ：キャッシュが使われず実際に通信が走った時だけ出力される
      console.log('--- fetch実行: BFFへリクエストを送信します ---'); 
      const response = await axiosClient.get<KarteResponse[]>(`/karte`);
      return response.data;
    },
    staleTime: 1000 * 60 * 5,    // 5分間はデータを「新鮮」と見なす
    refetchOnWindowFocus: false, // ウィンドウフォーカス時の再取得を無効化
  });
};