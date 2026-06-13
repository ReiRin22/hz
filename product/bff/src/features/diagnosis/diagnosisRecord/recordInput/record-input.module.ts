import { Module } from '@nestjs/common';
import { RecordInputController } from './record-input.controller';
import { RecordInputService } from './record-input.service';

@Module({
  controllers: [RecordInputController],
  providers: [RecordInputService],
})
export class RecordInputModule {}
