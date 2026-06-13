import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransfusionSystemController } from './transfusion-system.controller';
import { TransfusionSystemService } from './transfusion-system.service';
import { TransfusionSystemClient } from './transfusion-system.client';

@Module({
  imports: [HttpModule],
  controllers: [TransfusionSystemController],
  providers: [TransfusionSystemService, TransfusionSystemClient],
})
export class TransfusionSystemModule {}
