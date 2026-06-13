import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InjectionOutputController } from './injection-output.controller';
import { InjectionOutputService } from './injection-output.service';
import { InjectionOutputClient } from './injection-output.client';

@Module({
  imports: [HttpModule],
  controllers: [InjectionOutputController],
  providers: [InjectionOutputService, InjectionOutputClient],
})
export class InjectionOutputModule {}
