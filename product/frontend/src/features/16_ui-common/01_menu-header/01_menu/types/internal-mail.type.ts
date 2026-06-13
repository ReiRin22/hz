export interface Email {
  id: string;
  subject: string;
  sender?: string;
  recipient?: string;
  date: string;
  content: string;
  isRead: boolean;
  isDeleted: boolean;
}
