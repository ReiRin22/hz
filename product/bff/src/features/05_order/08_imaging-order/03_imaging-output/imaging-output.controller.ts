import { Controller } from '@nestjs/common';
import { ImagingOutputService } from './imaging-output.service';

@Controller('imaging-output')
export class ImagingOutputController {
  constructor(private readonly imagingOutputService: ImagingOutputService) {}

  // TODO: エンドポイントを実装
}
