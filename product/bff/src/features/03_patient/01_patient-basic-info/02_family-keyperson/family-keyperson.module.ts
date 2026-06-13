import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FamilyKeypersonController } from './family-keyperson.controller';
import { FamilyKeypersonService } from './family-keyperson.service';
import { FamilyKeypersonClient } from './family-keyperson.client';

@Module({
  imports: [HttpModule],
  controllers: [FamilyKeypersonController],
  providers: [FamilyKeypersonService, FamilyKeypersonClient],
})
export class FamilyKeypersonModule {}
