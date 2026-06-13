import { Injectable } from '@nestjs/common';
import { ImagingCheckClient } from './imaging-check.client';

@Injectable()
export class ImagingCheckService {
  constructor(private readonly imagingCheckClient: ImagingCheckClient) {}

  // TODO: ビジネスロジックを実装
}
