import { Injectable } from '@nestjs/common';
import { ImagingOutputClient } from './imaging-output.client';

@Injectable()
export class ImagingOutputService {
  constructor(private readonly imagingOutputClient: ImagingOutputClient) {}

  // TODO: ビジネスロジックを実装
}
