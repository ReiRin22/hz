import axios, { type InternalAxiosRequestConfig } from 'axios';
import { randomUUID } from 'node:crypto';

export const axiosClient = axios.create({
  baseURL: process.env.BE_BASE_URL ?? 'http://karte-domain-service:7121',
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // テナントIDをヘッダーに追加
  const tenantId = 'tenant_a';
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }

  // X-Correlation-Id が未設定の場合は UUID を自動付与
  if (!config.headers['x-correlation-id']) {
    config.headers['x-correlation-id'] = randomUUID();
  }

  // TODO(G): BFF間サービスアカウントトークンを Authorization ヘッダに設定する。
  // 実装手順:
  //   1. 認証サービスからサービスアカウントトークンを取得するモジュールを作成
  //   2. config.headers['Authorization'] = `Bearer ${token}` を設定
  //   3. トークンの有効期限を管理し、期限切れ前に自動更新する
  // バックエンド側でも Authorization ヘッダの検証ミドルウェアを有効化すること。

  console.log('[BFF共通基盤] インターセプター通過。Method:', config.method);
  return config;
});
