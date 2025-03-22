import { Injectable } from '@nestjs/common';
import { IndexEnum } from '../../network/enums/index.enum';
import { NearService } from './near/near.service';
import { ArbitrumService } from './arbitrum/arbitrum.service';

@Injectable()
export class ProtocolIndex {
  constructor(
    private readonly nearService: NearService,
    private readonly arbitrumService: ArbitrumService,
  ) {}

  private protocolIndex = {
    [IndexEnum.NEAR]: this.nearService,
    [IndexEnum.ARBITRUM]: this.arbitrumService,
  };

  getProtocolService(index: IndexEnum) {
    return this.protocolIndex[index];
  }

  getProtocolIndex() {
    return this.protocolIndex;
  }
}
