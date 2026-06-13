import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SurgeryTransfusionController } from './surgery-transfusion.controller';
import { SurgeryTransfusionService } from './surgery-transfusion.service';
import { SurgeryTransfusionClient } from './surgery-transfusion.client';

@Module({
  imports: [HttpModule],
  controllers: [SurgeryTransfusionController],
  providers: [SurgeryTransfusionService, SurgeryTransfusionClient],
})
export class SurgeryTransfusionModule {}
