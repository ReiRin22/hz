import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyInputController } from './proxy-input.controller';
import { ProxyInputService } from './proxy-input.service';
import { ProxyInputClient } from './proxy-input.client';

@Module({
  imports: [HttpModule],
  controllers: [ProxyInputController],
  providers: [ProxyInputService, ProxyInputClient],
})
export class ProxyInputModule {}
