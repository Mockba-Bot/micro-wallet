import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ExceptionHandler } from 'src/helpers/handlers/exception.handler';
import { NetworksEnum } from 'src/modules/network/enums/networks.enum';
import {
  CreateWalletsDto,
  IsAddressDto,
  TransferDto,
  TransferTokenDto,
  ImportWalletsFromMnemonicDto,
  TransferNftDto,
} from './blockchain.dto';
import { CryptShared } from 'src/shared/utils/crypt.shared';
import { IndexEnum } from '../network/enums/index.enum';
import { WalletService } from '../wallet/wallet.service';
import { NetworkService } from '../network/network.service';
import { ProtocolIndex } from './protocols/protocol.index';
import { TokenService } from '../token/token.service';

@Injectable()
export class BlockchainService {
  constructor(
    private readonly walletService: WalletService,
    private readonly networkService: NetworkService,
    private readonly protocolIndex: ProtocolIndex,
    private readonly tokenService: TokenService,
  ) {} //

  private async getCredentialsByMnemonic(mnemonic: string): Promise<
    {
      network: NetworksEnum;
      index: IndexEnum;
      address: string;
      privateKey: string;
    }[]
  > {
    try {
      const credentials: {
        network: NetworksEnum;
        index: IndexEnum;
        address: string;
        privateKey: string;
      }[] = [];

      for (const [name, service] of Object.entries(this.protocolIndex.getProtocolIndex())) {
        try {
          const credential = await service.fromMnemonic(mnemonic);
          credentials.push(credential);
        } catch (error) {
          console.error(`Failed to retrieve credentials for ${name}:`, error);
          throw new InternalServerErrorException(`Failed to retrieve credentials for ${name}`);
        }
      }

      return credentials;
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async createWallets(userId: string, createWalletsDto: CreateWalletsDto) {
    try {
      // const mnemonic = CryptShared.decryptRsa(createWalletsDto.mnemonic);
      const mnemonic = createWalletsDto.mnemonic;

      const wallet = await this.walletService.getUserIdByMnemonic(createWalletsDto.mnemonic).catch(() => null);

      if (wallet) {
        throw new ConflictException('Frase semilla ya en uso');
      }

      const networks = await this.networkService.findAllActive();

      const wallets = await this.walletService.findByUserId(userId);

      const credentials = await this.getCredentialsByMnemonic(mnemonic);

      for (const credential of credentials) {
        const network = networks.find((network) => network.index === credential.index);

        if (!network) {
          throw new HttpException('Red no encontrada', HttpStatus.NOT_FOUND);
        }

        const walletFound = wallets.find(
          (wallet) => wallet.address === credential.address && wallet.network.index === network.index,
        );

        if (!walletFound) {
          await this.walletService.create(userId, {
            address: credential.address,
            network: network.id,
          });
        }
      }

      return credentials;
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async importWalletsFromMnemonic(importWalletsFromMnemonicDto: ImportWalletsFromMnemonicDto): Promise<
    {
      network: string;
      address: string;
      privateKey: string;
    }[]
  > {
    try {
      // const mnemonic = CryptShared.decryptRsa(importWalletsDto.mnemonic);
      const mnemonic = importWalletsFromMnemonicDto.mnemonic;

      const userId = importWalletsFromMnemonicDto.userId;

      const networks = await this.networkService.findAllActive();

      const wallets = await this.walletService.findByUserId(userId);

      const credentials = await this.getCredentialsByMnemonic(mnemonic);

      for (const credential of credentials) {
        const network = networks.find((network) => network.index === credential.index);

        if (!network) {
          throw new HttpException('Red no encontrada', HttpStatus.NOT_FOUND);
        }

        const walletFound = wallets.find(
          (wallet) => wallet.address === credential.address && wallet.network.index === network.index,
        );

        if (!walletFound) {
          await this.walletService.create(userId, {
            address: credential.address,
            network: network.id,
          });
        }
      }

      return credentials;
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async isAddress(isAddressDto: IsAddressDto): Promise<boolean> {
    try {
      return await this.protocolIndex.getProtocolService(isAddressDto.network).isAddress(isAddressDto.address);
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async getBalance(
    userId: string,
    network: IndexEnum,
  ): Promise<{
    network: NetworksEnum;
    symbol: string;
    index: IndexEnum;
    balance: number;
    decimals: number;
  }> {
    try {
      const wallet = await this.walletService.findOneByUserIdAndIndex(userId, network);

      const service = this.protocolIndex.getProtocolService(network);

      const balance = await service.getBalance(wallet.address);

      return {
        network: wallet.network.name,
        symbol: wallet.network.symbol,
        index: wallet.network.index,
        balance,
        decimals: wallet.network.decimals,
      };
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async getBalanceToken(userId: string, tokenId: string) {
    try {
      const tokenFound = await this.tokenService.findOneWithRelations(tokenId);

      const wallet = await this.walletService.findOneByUserIdAndIndex(userId, tokenFound.network.index);

      const service = this.protocolIndex.getProtocolService(tokenFound.network.index);

      const balance = await service.getBalanceToken(wallet.address, tokenFound.contract, tokenFound.decimals);

      return {
        network: wallet.network.name,
        index: wallet.network.index,
        token: tokenFound.tokenData.name,
        tokenId: tokenFound.id,
        symbol: tokenFound.tokenData.symbol,
        balance,
        decimals: tokenFound.decimals,
      };
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async getBalances(
    userId: string,
    hasBalance: boolean,
  ): Promise<
    {
      network: NetworksEnum;
      index: IndexEnum;
      symbol: string;
      balance: number;
      tokens: {
        token: string;
        symbol: string;
        tokenId: string;
        balance: number;
        decimals: number;
      }[];
    }[]
  > {
    try {
      const balances: {
        network: NetworksEnum;
        index: IndexEnum;
        symbol: string;
        balance: number;
        decimals: number;
        tokens: {
          token: string;
          symbol: string;
          tokenId: string;
          balance: number;
          decimals: number;
        }[];
      }[] = [];

      const protocols = Object.entries(this.protocolIndex.getProtocolIndex());

      // Ejecutamos la primera iteración de protocolos en paralelo
      await Promise.all(
        protocols.map(async ([name, service]) => {
          try {
            const wallet = await this.walletService.findOneByUserIdAndIndex(userId, name as IndexEnum);

            const [balance, tokensFound] = await Promise.all([
              service.getBalance(wallet.address),
              this.tokenService.findByNetwork(wallet.network.id),
            ]);

            const balanceTokens: {
              token: string;
              symbol: string;
              tokenId: string;
              balance: number;
              decimals: number;
            }[] = [];

            for (const token of tokensFound) {
              const tokenBalance = await service.getBalanceToken(wallet.address, token.contract, token.decimals);

              if (hasBalance && tokenBalance === 0) {
                continue;
              }

              const item = {
                token: token.tokenData.name,
                symbol: token.tokenData.symbol,
                tokenId: token.id,
                balance: tokenBalance,
                decimals: token.decimals,
              };

              balanceTokens.push(item);
            }

            if (hasBalance && balance === 0 && balanceTokens.length === 0) {
              return;
            }

            balances.push({
              network: wallet.network.name,
              index: wallet.network.index,
              symbol: wallet.network.symbol,
              balance,
              decimals: wallet.network.decimals,
              tokens: balanceTokens,
            });
          } catch (error) {
            console.error(`Failed to retrieve balance for ${name}:`, error);
            throw new InternalServerErrorException(`Failed to retrieve balance for ${name}`);
          }
        }),
      );

      return balances;
    } catch (error) {
      console.error('Failed to retrieve balances:', error);
      throw new InternalServerErrorException('Failed to retrieve balances');
    }
  }

  async transfer(
    userId: string,
    privateKey: string,
    transferDto: TransferDto,
  ): Promise<{
    network: NetworksEnum;
    index: IndexEnum;
    hash: string;
  }> {
    try {
      console.log('transferDto', transferDto);
      const wallet = await this.walletService.findOneByUserIdAndIndex(userId, transferDto.network);

      const service = this.protocolIndex.getProtocolService(transferDto.network);

      console.log('wallet', wallet);

      const txHash = await service.transfer(wallet.address, privateKey, transferDto.toAddress, transferDto.amount);

      console.log('txHash', txHash);

      return { network: wallet.network.name, index: wallet.network.index, hash: txHash };
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async transferToken(userId: string, privateKey: string, transferDto: TransferTokenDto) {
    try {
      const token = await this.tokenService.findOneWithRelations(transferDto.token);

      const wallet = await this.walletService.findOneByUserIdAndIndex(userId, transferDto.network);

      const service = this.protocolIndex.getProtocolService(transferDto.network);

      const txHash = await service.transferToken(
        wallet.address,
        privateKey,
        transferDto.toAddress,
        transferDto.amount,
        token.contract,
        token.decimals,
      );

      return {
        network: wallet.network.name,
        index: wallet.network.index,
        token: token.tokenData.name,
        tokenId: token.id,
        hash: txHash,
      };
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async getFeeTransfer(userId: string, network: IndexEnum, amount?: number) {
    try {
      const wallet = await this.walletService.findOneByUserIdAndIndex(userId, network);

      const service = this.protocolIndex.getProtocolService(network);

      return await service.getFeeTransfer(amount, wallet.address);
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async getFeeTransferToken(network: IndexEnum) {
    try {
      const service = this.protocolIndex.getProtocolService(network);

      return service.getFeeTransferToken();
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async transferNft(
    userId: string,
    privateKey: string,
    transferNftDto: TransferNftDto,
  ): Promise<{
    network: NetworksEnum;
    index: IndexEnum;
    hash: string;
    txLink: string;
  }> {
    try {
      console.log('transferNftDto', transferNftDto);
      const wallet = await this.walletService.findOneByUserIdAndIndex(userId, transferNftDto.network);

      const service = this.protocolIndex.getProtocolService(transferNftDto.network);

      console.log('wallet', wallet);

      const txHash = await service.transferNft(
        wallet.address,
        privateKey,
        transferNftDto.tokenId,
        transferNftDto.contract,
        transferNftDto.destination,
      );

      console.log('txHash', txHash);

      return {
        network: wallet.network.name,
        index: wallet.network.index,
        hash: txHash,
        txLink: service.getLinkTransaction(txHash),
      };
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }
}
