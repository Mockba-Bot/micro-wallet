import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpCustomService } from '../../shared/http/http.service';
import { UserService } from '../user/user.service';
import { ImportFromMnemonicDto, ImportFromPkDto } from './dto/auth.dto';
import { log } from 'console';
import { WalletService } from '../wallet/wallet.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpCustomService,
    private readonly walletService: WalletService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async importFromMnemonic(importFromMnemonicDto: ImportFromMnemonicDto): Promise<any> {
    const responseUserId = await this.walletService.getUserIdByMnemonic(importFromMnemonicDto.mnemonic);

    if (!responseUserId?.userId) {
      throw new UnauthorizedException('User not found');
    }

    const { userId } = responseUserId;

    const user = await this.userService.findOne(userId);

    const body = {
      mnemonic: importFromMnemonicDto.mnemonic,
      userId: userId,
    };

    const response = await this.blockchainService.importWalletsFromMnemonic(body);

    if (!response || typeof response.length !== 'number') {
      throw new InternalServerErrorException('Failed to import wallets');
    }

    const payload = {
      userId: user.id,
      mnemonic: importFromMnemonicDto.mnemonic,
      credentials: response,
    };

    return {
      ...user,
      token: await this.jwtService.signAsync(payload, { expiresIn: '31d' }),
      credencials: response,
    };
  }
}
