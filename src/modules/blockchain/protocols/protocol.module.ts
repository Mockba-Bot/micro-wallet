import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Near } from 'near-api-js';
import { NearModule } from './near/near.module';
import { ArbitrumModule } from './arbitrum/arbitrum.module';
import { ProtocolIndex } from './protocol.index';

@Module({
  imports: [NearModule, ArbitrumModule],
  exports: [ProtocolIndex, NearModule, ArbitrumModule],
  controllers: [],
  providers: [ProtocolIndex],
})
export class ProtocolModule {}
