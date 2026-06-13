import { Controller } from '@nestjs/common';
import { BedExitDetectionService } from './bed-exit-detection.service';

@Controller('bed-exit-detection')
export class BedExitDetectionController {
  constructor(private readonly bedExitDetectionService: BedExitDetectionService) {}

  // TODO: エンドポイントを実装
}
