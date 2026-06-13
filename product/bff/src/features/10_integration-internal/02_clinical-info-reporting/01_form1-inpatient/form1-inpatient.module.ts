import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Form1InpatientController } from './form1-inpatient.controller';
import { Form1InpatientService } from './form1-inpatient.service';
import { Form1InpatientClient } from './form1-inpatient.client';

@Module({
  imports: [HttpModule],
  controllers: [Form1InpatientController],
  providers: [Form1InpatientService, Form1InpatientClient],
})
export class Form1InpatientModule {}
