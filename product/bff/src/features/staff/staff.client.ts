import { Injectable } from "@nestjs/common";
import type { UpstreamStaffMember } from "./types/staff.type";

export type { UpstreamStaffMember };

/** モックデータ（上流スタッフマスター API 未実装のため） */
const MOCK_STAFF: UpstreamStaffMember[] = [
  { staffId: "doc0", staffName: "田中 一郎", staffRole: "DOCTOR", department: "内科" },
  { staffId: "doc1", staffName: "山田 太郎", staffRole: "DOCTOR", department: "内科" },
  { staffId: "doc2", staffName: "佐藤 花子", staffRole: "DOCTOR", department: "外科" },
  { staffId: "doc3", staffName: "田中 次郎", staffRole: "DOCTOR", department: "整形外科" },
  { staffId: "nurse1", staffName: "鈴木 美咲", staffRole: "NURSE", department: "内科" },
  { staffId: "nurse2", staffName: "高橋 健太", staffRole: "NURSE", department: "外科" },
  { staffId: "clerk1", staffName: "伊藤 愛美", staffRole: "CLERK", department: "医事課" },
];

@Injectable()
export class StaffClient {
  /**
   * 上流スタッフマスターからスタッフ一覧を取得する
   * TODO: 上流 API の URL・認証ヘッダーを実装する
   */
  async fetchStaff(): Promise<UpstreamStaffMember[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/staff`) に差し替え
    return MOCK_STAFF;
  }
}
