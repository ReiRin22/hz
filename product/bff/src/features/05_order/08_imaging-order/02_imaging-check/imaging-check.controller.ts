import { Controller } from '@nestjs/common';
import { ImagingCheckService } from './imaging-check.service';

@Controller('imaging-check')
export class ImagingCheckController {
  constructor(private readonly imagingCheckService: ImagingCheckService) {}

  // TODO: エンドポイントを実装
}
