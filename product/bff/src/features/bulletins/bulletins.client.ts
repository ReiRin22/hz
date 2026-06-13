import { Injectable } from "@nestjs/common";
import { UpstreamBulletinPost } from "./types/bulletins.type";

const MOCK_BULLETIN_POSTS: UpstreamBulletinPost[] = [
  {
    postId: "1",
    category: "重要",
    categoryColor: "red",
    postDate: "2024/12/20",
    title: "年末年始の診療体制について",
    content:
      "12月29日（日）から1月3日（金）まで、救急外来のみ診療いたします。通常外来は1月4日（土）より再開予定です。",
    author: "事務局",
  },
  {
    postId: "2",
    category: "お知らせ",
    categoryColor: "blue",
    postDate: "2024/12/18",
    title: "電子カルテシステムメンテナンス",
    content:
      "12月22日（日）AM2:00〜6:00の間、システムメンテナンスを実施します。この時間帯は電子カルテが使用できません。",
    author: "システム管理室",
  },
  {
    postId: "3",
    category: "研修",
    categoryColor: "green",
    postDate: "2024/12/15",
    title: "感染対策研修会のご案内",
    content:
      "12月25日（水）15:00より、感染対策研修会を開催します。全スタッフ参加必須です。場所: 3階会議室A",
    author: "感染対策委員会",
  },
  {
    postId: "4",
    category: "連絡",
    categoryColor: "yellow",
    postDate: "2024/12/12",
    title: "薬剤在庫確認のお願い",
    content:
      "各病棟の薬剤担当者は、12月20日までに在庫確認を完了し、薬剤部まで報告してください。",
    author: "薬剤部",
  },
  {
    postId: "5",
    category: "イベント",
    categoryColor: "purple",
    postDate: "2024/12/10",
    title: "クリスマスイベント開催",
    content:
      "12月24日（火）に小児病棟でクリスマスイベントを開催します。ボランティア参加者を募集中です。",
    author: "地域連携室",
  },
];

@Injectable()
export class BulletinsClient {
  async fetchBulletins(): Promise<UpstreamBulletinPost[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/bulletins`) に差し替え
    return MOCK_BULLETIN_POSTS;
  }
}
