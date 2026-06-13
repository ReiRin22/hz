import { Controller } from '@nestjs/common';
import { MoveRegistrationService } from './move-registration.service';

@Controller('move-registration')
export class MoveRegistrationController {
  constructor(private readonly moveRegistrationService: MoveRegistrationService) {}

  // TODO: エンドポイントを実装
}
