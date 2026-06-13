import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MoveRegistrationController } from './move-registration.controller';
import { MoveRegistrationService } from './move-registration.service';
import { MoveRegistrationClient } from './move-registration.client';

@Module({
  imports: [HttpModule],
  controllers: [MoveRegistrationController],
  providers: [MoveRegistrationService, MoveRegistrationClient],
})
export class MoveRegistrationModule {}
