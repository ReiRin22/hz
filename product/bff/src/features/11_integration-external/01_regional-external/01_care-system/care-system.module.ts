import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CareSystemController } from './care-system.controller';
import { CareSystemService } from './care-system.service';
import { CareSystemClient } from './care-system.client';

@Module({
  imports: [HttpModule],
  controllers: [CareSystemController],
  providers: [CareSystemService, CareSystemClient],
})
export class CareSystemModule {}
