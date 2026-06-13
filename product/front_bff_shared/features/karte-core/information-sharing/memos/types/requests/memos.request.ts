export type GetMemosQueryType = "received" | "sent";

export interface CreateMemoRequest {
  title: string;
  content: string;
  to: string;
}
