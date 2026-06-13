import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { MemosClient } from "./memos.client";
import { UpstreamMemo } from "./types/memos.type";
import {
  GetMemosQueryType,
  CreateMemoRequest,
} from "./types/memos.api.request";
import {
  MemoResponse,
  GetMemosResponse,
  CreateMemoResponse,
  ConfirmMemoResponse,
} from "./types/memos.api.response";

const VALID_MEMO_TYPES: GetMemosQueryType[] = ["received", "sent"];

// TODO: 上流APIから取得したログインユーザー情報に差し替え
const CURRENT_USER_NAME = "田中 健太 医師";

@Injectable()
export class MemosService {
  constructor(@Inject(MemosClient) private readonly memosClient: MemosClient) {}

  async getMemos(type: string | undefined): Promise<GetMemosResponse> {
    if (!type || !VALID_MEMO_TYPES.includes(type as GetMemosQueryType)) {
      throw new BadRequestException(
        `type must be one of: ${VALID_MEMO_TYPES.join(", ")}`,
      );
    }
    const upstream = await this.memosClient.fetchMemos(
      type as GetMemosQueryType,
    );
    return {
      memos: upstream.map((m) => this.transform(m)),
    };
  }

  async createMemo(req: CreateMemoRequest): Promise<CreateMemoResponse> {
    const upstream = await this.memosClient.createMemo(req, CURRENT_USER_NAME);
    return this.transform(upstream);
  }

  async confirmMemo(memoId: string): Promise<ConfirmMemoResponse> {
    await this.memosClient.confirmMemo(memoId);
    return {
      id: memoId,
      confirmed: true,
    };
  }

  private transform(upstream: UpstreamMemo): MemoResponse {
    return {
      id: upstream.memoId,
      title: upstream.title,
      content: upstream.content,
      to: upstream.toStaff,
      from: upstream.fromStaff,
      datetime: upstream.sentAt,
    };
  }
}
