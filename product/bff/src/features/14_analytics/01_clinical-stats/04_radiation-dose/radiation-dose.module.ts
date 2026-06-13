import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RadiationDoseController } from './radiation-dose.controller';
import { RadiationDoseService } from './radiation-dose.service';
import { RadiationDoseClient } from './radiation-dose.client';

@Module({
  imports: [HttpModule],
  controllers: [RadiationDoseController],
  providers: [RadiationDoseService, RadiationDoseClient],
})
export class RadiationDoseModule {}
