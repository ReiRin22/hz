import { Controller } from '@nestjs/common';
import { NurseCallService } from './nurse-call.service';

@Controller('nurse-call')
export class NurseCallController {
  constructor(private readonly nurseCallService: NurseCallService) {}

  // TODO: エンドポイントを実装
}
