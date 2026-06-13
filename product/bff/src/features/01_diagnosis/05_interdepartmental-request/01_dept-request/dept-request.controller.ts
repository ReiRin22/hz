import { Controller } from '@nestjs/common';
import { DeptRequestService } from './dept-request.service';

@Controller('dept-request')
export class DeptRequestController {
  constructor(private readonly deptRequestService: DeptRequestService) {}

  // TODO: エンドポイントを実装
}
