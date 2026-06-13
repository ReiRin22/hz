export interface UserResponse {
  id: string;
  displayName: string; // 整形後の名前
  ageGroup: string;    // 年代 (例: "20代")
  bio: string;
  statsSummary: string; // 投稿数とフォロワーのサマリー
}