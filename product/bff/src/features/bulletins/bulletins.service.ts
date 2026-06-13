import { Injectable, Inject } from "@nestjs/common";
import { BulletinsClient } from "./bulletins.client";
import { UpstreamBulletinPost } from "./types/bulletins.type";
import {
  BulletinPostResponse,
  GetBulletinsResponse,
} from "./types/bulletins.api.response";

@Injectable()
export class BulletinsService {
  constructor(@Inject(BulletinsClient) private readonly bulletinsClient: BulletinsClient) {}

  async getBulletins(): Promise<GetBulletinsResponse> {
    const upstream = await this.bulletinsClient.fetchBulletins();
    return {
      posts: upstream.map((p) => this.transform(p)),
    };
  }

  private transform(upstream: UpstreamBulletinPost): BulletinPostResponse {
    return {
      id: upstream.postId,
      category: upstream.category,
      categoryColor: upstream.categoryColor,
      date: upstream.postDate,
      title: upstream.title,
      content: upstream.content,
      author: upstream.author,
    };
  }
}
