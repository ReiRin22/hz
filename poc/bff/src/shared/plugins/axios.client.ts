import axios from 'axios';
import * as https from 'https';

/**
 * 日本語対応のダミー難読化関数
 */
const safeObfuscate = (data: any) => {
  if (!data) return data;
  const jsonStr = JSON.stringify(data);
  // 1. 文字列をUTF-8のバイト配列に変換
  const uint8array = new TextEncoder().encode(jsonStr);
  // 2. バイト配列を文字列に変換してからBase64化
  let binString = "";
  uint8array.forEach((byte) => {
    binString += String.fromCharCode(byte);
  });
  return btoa(binString);
};

export const axiosClient = axios.create({
  baseURL: 'http://karte-domain-service:7121',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // 開発環境での自己署名証明書エラーを無視
  }),
});

axiosClient.interceptors.request.use((config) => {
  // テナントIDをヘッダーに追加
  const tenantId = 'tenant_a';
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }
  console.log('[BFF共通基盤] インターセプター通過。Method:', config.method);

  // ★ 修正ポイント：FormData の場合は難読化処理をスキップする
  if (config.data && !(config.data instanceof FormData)) {
    console.log('[BFF共通基盤] 通常データを隠蔽します');
    config.data = {
      payload: safeObfuscate(config.data),
      _obfuscated: true
    };
  } else if (config.data instanceof FormData) {
    console.log('[BFF共通基盤] FormDataを検知。難読化をスキップしてそのまま送信します。');
    // FormData の場合はブラウザに Content-Type を任せるため、axios 側のデフォルトを消す
    delete config.headers['Content-Type'];
  } else {
    // もしここが出るなら、updateUserからのデータ渡しに失敗しています
    console.warn('[BFF共通基盤] Warning: config.data が空です。難読化をスキップしました。');
  }
  return config;
});