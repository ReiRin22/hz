export class BffApiError extends Error {
  constructor(
    public readonly code: 'E401' | 'E403' | 'E404' | 'E409' | 'E504' | 'E999',
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'BffApiError';
  }
}

export function classifyHttpError(status: number): BffApiError {
  if (status === 401) return new BffApiError('E401', status, '認証に失敗しました');
  if (status === 403) return new BffApiError('E403', status, '権限がありません');
  if (status === 404) return new BffApiError('E404', status, 'データが存在しません');
  if (status === 409) return new BffApiError('E409', status, '既に同じデータが存在します');
  if (status === 504) return new BffApiError('E504', status, '処理がタイムアウトしました');
  return new BffApiError('E999', status, 'システムエラーが発生しました');
}
