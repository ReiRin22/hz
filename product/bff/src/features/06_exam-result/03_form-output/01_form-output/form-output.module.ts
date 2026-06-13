import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FormOutputController } from './form-output.controller';
import { FormOutputService } from './form-output.service';
import { FormOutputClient } from './form-output.client';

@Module({
  imports: [HttpModule],
  controllers: [FormOutputController],
  providers: [FormOutputService, FormOutputClient],
})
export class FormOutputModule {}
