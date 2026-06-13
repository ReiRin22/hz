import { Injectable } from '@nestjs/common';
import { DeptRequestClient } from './dept-request.client';

@Injectable()
export class DeptRequestService {
  constructor(private readonly deptRequestClient: DeptRequestClient) {}

  // TODO: ビジネスロジックを実装
}
