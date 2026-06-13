import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdmissionTransferController } from './admission-transfer.controller';
import { AdmissionTransferService } from './admission-transfer.service';
import { AdmissionTransferClient } from './admission-transfer.client';

@Module({
  imports: [HttpModule],
  controllers: [AdmissionTransferController],
  providers: [AdmissionTransferService, AdmissionTransferClient],
})
export class AdmissionTransferModule {}
