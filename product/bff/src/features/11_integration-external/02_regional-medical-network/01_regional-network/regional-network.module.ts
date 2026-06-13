import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RegionalNetworkController } from './regional-network.controller';
import { RegionalNetworkService } from './regional-network.service';
import { RegionalNetworkClient } from './regional-network.client';

@Module({
  imports: [HttpModule],
  controllers: [RegionalNetworkController],
  providers: [RegionalNetworkService, RegionalNetworkClient],
})
export class RegionalNetworkModule {}
