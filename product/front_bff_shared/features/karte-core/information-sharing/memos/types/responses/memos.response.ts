export interface MemoResponse {
  id: string;
  title: string;
  content: string;
  to: string;
  from: string;
  datetime: string;
}

export interface GetMemosResponse {
  memos: MemoResponse[];
}

export type CreateMemoResponse = MemoResponse;

export interface ConfirmMemoResponse {
  id: string;
  confirmed: boolean;
}
