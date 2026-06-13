import { Injectable } from '@nestjs/common';
import { ExternalIdParam } from './types/user.api.request';
import { BaseInfo, ProfileInfo, StatsInfo } from './types/user.api.response';

@Injectable() // 1言：これを忘れると Module の providers に入れてもエラーになります
export class UserClient {
    fetchBase = async (p: ExternalIdParam): Promise<BaseInfo> => ({ id: p.targetId, name: "Taro Yamada" });
    fetchProfile = async (p: ExternalIdParam): Promise<ProfileInfo> => ({ age: 25, bio: "Fullstack Developer" });
    fetchStats = async (p: ExternalIdParam): Promise<StatsInfo> => ({ posts: 120, followers: 5000 });
}