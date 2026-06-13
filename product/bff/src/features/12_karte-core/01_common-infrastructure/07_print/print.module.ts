import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrintController } from './print.controller';
import { PrintService } from './print.service';
import { PrintClient } from './print.client';

@Module({
  imports: [HttpModule],
  controllers: [PrintController],
  providers: [PrintService, PrintClient],
})
export class PrintModule {}
