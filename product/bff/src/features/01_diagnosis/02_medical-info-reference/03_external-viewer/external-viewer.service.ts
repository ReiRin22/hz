import { Injectable } from '@nestjs/common';
import { ExternalViewerClient } from './external-viewer.client';

@Injectable()
export class ExternalViewerService {
  constructor(private readonly externalViewerClient: ExternalViewerClient) {}

  // TODO: ビジネスロジックを実装
}
