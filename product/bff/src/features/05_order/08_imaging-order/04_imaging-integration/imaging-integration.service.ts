import { Injectable } from '@nestjs/common';
import { ImagingIntegrationClient } from './imaging-integration.client';

@Injectable()
export class ImagingIntegrationService {
  constructor(private readonly imagingIntegrationClient: ImagingIntegrationClient) {}

  // TODO: ビジネスロジックを実装
}
