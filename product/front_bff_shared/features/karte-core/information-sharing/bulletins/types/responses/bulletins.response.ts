export interface BulletinPostResponse {
  id: string;
  category: string;
  categoryColor: string;
  date: string;
  title: string;
  content: string;
  author: string;
}

export interface GetBulletinsResponse {
  posts: BulletinPostResponse[];
}
