import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingDatabaseController } from './nursing-database.controller';
import { NursingDatabaseService } from './nursing-database.service';
import { NursingDatabaseClient } from './nursing-database.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingDatabaseController],
  providers: [NursingDatabaseService, NursingDatabaseClient],
})
export class NursingDatabaseModule {}
