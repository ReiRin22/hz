import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutpatientCountController } from './outpatient-count.controller';
import { OutpatientCountService } from './outpatient-count.service';
import { OutpatientCountClient } from './outpatient-count.client';

@Module({
  imports: [HttpModule],
  controllers: [OutpatientCountController],
  providers: [OutpatientCountService, OutpatientCountClient],
})
export class OutpatientCountModule {}
