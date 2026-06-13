import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RightSidemenuClient {
  constructor(private readonly httpService: HttpService) {}

  // TODO: バックエンドAPI呼び出しを実装
}
