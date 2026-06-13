import { Injectable } from '@nestjs/common';
import { PatientInfo } from '@/features/karte/types/karte.api.response';

@Injectable() // 1言：これを忘れると Module の providers に入れてもエラーになります
export class KarteClient {
  fetchPatient = async (): Promise<PatientInfo[]> => {
    return Array.from({ length: 10000 }, (_, i) => ({
      id: (i + 1).toString(),
      name: `ユーザー ${i + 1}`,
      description: `${i + 1}番目のユーザーの経過記録詳細データです。`
    }));
  };
}