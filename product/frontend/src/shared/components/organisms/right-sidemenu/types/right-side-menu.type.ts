export interface MemoData {
  id: string;
  title: string;
  content: string;
  to: string;
  from: string;
  datetime: string;
}

export interface BulletinBoardItem {
  id: string;
  tag: string;
  tagColor: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  date: string;
  title: string;
  content: string;
  author: string;
}
