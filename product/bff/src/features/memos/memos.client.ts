import { Injectable } from "@nestjs/common";
import { UpstreamMemo } from "./types/memos.type";
import { CreateMemoRequest } from "./types/memos.api.request";

const MOCK_RECEIVED_MEMOS: UpstreamMemo[] = [
  {
    memoId: "memo1",
    title: "採血追加のお願い",
    content:
      "先生、お疲れ様です。本日の山田太郎様（病室: 302号）の採血にHbA1cを追加していただけますでしょうか。先ほど患者様から糖尿病の既往があるとお聞きしました。",
    toStaff: "田中 健太 医師",
    fromStaff: "看護部",
    sentAt: "2025/10/27 11:40",
  },
  {
    memoId: "memo2",
    title: "回診時刻の変更について",
    content:
      "明日の午前回診を10:00から11:00に変更していただけますか。処置室の予約が入っています。",
    toStaff: "外科・臨床検査科",
    fromStaff: "田中 健太 医師",
    sentAt: "2024/12/23 09:15",
  },
  {
    memoId: "memo3",
    title: "抗生剤処方量の確認",
    content:
      "先生、現在処方中の抗生剤（セフトリアキソン）の用量を再確認していただけますでしょうか。患者体重の変化があり、適正用量かどうか気になっています。",
    toStaff: "薬剤部",
    fromStaff: "田中 健太 医師",
    sentAt: "2024/12/22 16:45",
  },
  {
    memoId: "memo4",
    title: "予約患者様からの問い合わせ",
    content:
      "来週月曜日に予約されている佐藤花子様から、診察時間の変更希望のご連絡がありました。先生のご都合をお伺いしたく、ご連絡いたしました。",
    toStaff: "田中 健太 医師",
    fromStaff: "事務",
    sentAt: "2024/12/22 14:20",
  },
  {
    memoId: "memo5",
    title: "栄養指導実施のご報告",
    content:
      "本日、田中一郎様（病室: 205号）の栄養指導を実施いたしました。塩分制限食の指導を行い、患者様も理解されていました。詳細は栄養指導記録をご確認ください。",
    toStaff: "田中 健太 医師",
    fromStaff: "栄養科",
    sentAt: "2024/12/21 11:00",
  },
  {
    memoId: "memo6",
    title: "CT読影結果の確認依頼",
    content:
      "昨日撮影した山本様のCT画像の読影が完了しました。レポートを電子カルテに登録済みです。緊急所見はありませんが、先生のご確認をお願いいたします。",
    toStaff: "田中 健太 医師",
    fromStaff: "放射線科",
    sentAt: "2024/12/21 08:30",
  },
];

const MOCK_SENT_MEMOS: UpstreamMemo[] = [
  {
    memoId: "sent1",
    title: "カンファレンス日程調整のお願い",
    content:
      "来週のケースカンファレンスについて、患者数が増えているため時間を30分延長させてください。皆様のご都合をご確認ください。",
    toStaff: "看護部・リハビリ科",
    fromStaff: "田中 健太 医師",
    sentAt: "2024/12/23 14:00",
  },
  {
    memoId: "sent2",
    title: "MRI検査追加オーダーについて",
    content:
      "鈴木様（病室: 412号）のMRI検査を追加オーダーしました。腰痛の精査が必要なため、今週中に撮影をお願いします。",
    toStaff: "放射線科",
    fromStaff: "田中 健太 医師",
    sentAt: "2024/12/23 11:20",
  },
  {
    memoId: "sent3",
    title: "薬剤変更の連絡",
    content:
      "高橋様の降圧薬をアムロジピン5mgからニフェジピンCR錠20mgに変更しました。副作用の浮腫が改善傾向です。引き続き経過観察をお願いします。",
    toStaff: "看護部",
    fromStaff: "田中 健太 医師",
    sentAt: "2024/12/22 17:30",
  },
  {
    memoId: "sent4",
    title: "退院サマリーの提出",
    content:
      "伊藤様の退院サマリーを電子カルテに提出しました。かかりつけ医への情報提供書も作成済みです。ご確認のほどよろしくお願いいたします。",
    toStaff: "医事課",
    fromStaff: "田中 健太 医師",
    sentAt: "2024/12/22 17:00",
  },
  {
    memoId: "sent5",
    title: "リハビリ開始の指示",
    content:
      "渡辺様（病室: 318号）のリハビリを本日より開始してください。起立訓練から始め、状態を見ながら段階的に負荷をあげていく方針です。",
    toStaff: "リハビリテーション科",
    fromStaff: "田中 健太 医師",
    sentAt: "2024/12/20 13:45",
  },
  {
    memoId: "sent6",
    title: "特別食対応のお願い",
    content:
      "中村様（病室: 201号）は食物アレルギー（そば・えび）があります。誤配膳防止のため、配膳時にアレルギー確認を徹底してください。",
    toStaff: "栄養科・看護部",
    fromStaff: "田中 健太 医師",
    sentAt: "2024/12/19 10:00",
  },
];

@Injectable()
export class MemosClient {
  async fetchMemos(type: "received" | "sent"): Promise<UpstreamMemo[]> {
    // TODO: axios.get(`${UPSTREAM_BASE_URL}/memos?type=${type}`) に差し替え
    return type === "received" ? MOCK_RECEIVED_MEMOS : MOCK_SENT_MEMOS;
  }

  async createMemo(
    req: CreateMemoRequest,
    fromStaff: string,
  ): Promise<UpstreamMemo> {
    // TODO: axios.post(`${UPSTREAM_BASE_URL}/memos`, req) に差し替え
    return {
      memoId: `memo-${Date.now()}`,
      title: req.title,
      content: req.content,
      toStaff: req.to,
      fromStaff,
      // TODO: 上流API実装後は上流APIのレスポンスから sentAt を取得する
      sentAt: new Date().toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }

  async confirmMemo(memoId: string): Promise<{ memoId: string }> {
    // TODO: axios.patch(`${UPSTREAM_BASE_URL}/memos/${memoId}/confirm`) に差し替え
    return { memoId };
  }
}
