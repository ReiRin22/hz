import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EPrescriptionMgmtController } from './e-prescription-mgmt.controller';
import { EPrescriptionMgmtService } from './e-prescription-mgmt.service';
import { EPrescriptionMgmtClient } from './e-prescription-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [EPrescriptionMgmtController],
  providers: [EPrescriptionMgmtService, EPrescriptionMgmtClient],
})
export class EPrescriptionMgmtModule {}
