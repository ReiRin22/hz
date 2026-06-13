import axios from 'axios';
import * as Sentry from '@sentry/nextjs';

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
  baseURL: 'http://localhost:3001/bff',
});

axiosClient.interceptors.request.use((config) => {
  // テナントIDをヘッダーに追加
  const tenantId = 'tenant_a';
  if (tenantId) {
    config.headers['x-tenant-id'] = tenantId;
  }
  console.log('[共通基盤] インターセプター通過。Method:', config.method);

  if (config.data) {
    console.log('[共通基盤] 送信データを隠蔽します:', config.data);
    config.data = {
      payload: safeObfuscate(config.data),
      _obfuscated: true
    };
    console.log('[共通基盤] 難読化後の送信内容:', config.data);
  } else {
    // もしここが出るなら、updateUserからのデータ渡しに失敗しています
    console.warn('[共通基盤] Warning: config.data が空です。難読化をスキップしました。');
  }
  return config;
});

// ========================================
// レスポンスインターセプター（エラー処理 + GlitchTip送信）
// ========================================
axiosClient.interceptors.response.use(
  // 成功時はそのまま返す
  (response) => response,

  // エラー時の処理
  (error) => {
    // エラー情報を収集
    const status = error.response?.status;
    const traceId = error.response?.data?.traceId; // BFFエラーレスポンスからtraceId取得
    const errorCode = error.response?.data?.errors?.[0]?.code;

    // リクエストヘッダーから実際に送信したテナントIDを取得
    const tenantId = error.config?.headers?.['x-tenant-id'] as string | undefined;

    // 業務エラー（バリデーションエラー等）はGlitchTipに送信しない
    const isBusinessError =
      status === 400 &&
      ['REQUIRED', 'INVALID_FORMAT', 'INVALID_TYPE'].includes(errorCode);

    if (!isBusinessError) {
      // GlitchTipにエラー送信
      Sentry.captureException(error, {
        tags: {
          tenant_id: tenantId, // リクエストヘッダーから取得（実際に送信した値）
          trace_id: traceId, // BFFから取得したtraceId
        },
        extra: {
          status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          errorResponse: error.response?.data, // BFFのエラーレスポンス全体
        },
      });

      console.error('[axiosClient] API Error sent to GlitchTip:', {
        url: error.config?.url,
        status,
        traceId,
      });
    } else {
      console.log('[axiosClient] Business error (not sent to GlitchTip):', {
        url: error.config?.url,
        errorCode,
      });
    }

    // エラーを呼び出し元に返す
    return Promise.reject(error);
  }
);