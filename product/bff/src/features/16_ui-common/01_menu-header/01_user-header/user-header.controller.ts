import { Controller } from '@nestjs/common';
import { UserHeaderService } from './user-header.service';

@Controller('user-header')
export class UserHeaderController {
  constructor(private readonly userHeaderService: UserHeaderService) {}

  // TODO: エンドポイントを実装
}
