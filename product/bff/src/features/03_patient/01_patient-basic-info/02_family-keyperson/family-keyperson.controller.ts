import { Controller } from '@nestjs/common';
import { FamilyKeypersonService } from './family-keyperson.service';

@Controller('family-keyperson')
export class FamilyKeypersonController {
  constructor(private readonly familyKeypersonService: FamilyKeypersonService) {}

  // TODO: エンドポイントを実装
}
