import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalViewerController } from './external-viewer.controller';
import { ExternalViewerService } from './external-viewer.service';
import { ExternalViewerClient } from './external-viewer.client';

@Module({
  imports: [HttpModule],
  controllers: [ExternalViewerController],
  providers: [ExternalViewerService, ExternalViewerClient],
})
export class ExternalViewerModule {}
