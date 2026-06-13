import { Injectable, Inject } from '@nestjs/common';
import { UserClient } from '@/features/user/user.client';
import { UserResponse } from '@/front_bff_shared/types/response/user.response.type';

@Injectable()
export class UserService {
  constructor(@Inject(UserClient) private readonly userClient: UserClient) {}

  async getUserFullDetails(id: string): Promise<UserResponse> {
    // 1. 3秒待機（検証用）
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. 外部API(Clients)から生データを並列取得
    const param = { targetId: id };
    const [base, profile, stats] = await Promise.all([
      this.userClient.fetchBase(param),
      this.userClient.fetchProfile(param),
      this.userClient.fetchStats(param)
    ]);

    // 3. データの整形（マッピングロジック）
    return {
      id: base.id,
      // 名前にさん付けする整形
      displayName: `${base.name} 様`, 
      // 年齢から年代を算出するロジック
      ageGroup: `${Math.floor(profile.age / 10) * 10}代`,
      bio: profile.bio,
      // 統計情報を文章化
      statsSummary: `投稿数: ${stats.posts.toLocaleString()} / フォロワー: ${stats.followers.toLocaleString()}人`
    };
  }
}