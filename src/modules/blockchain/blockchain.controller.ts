import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NetworksEnum } from '../network/enums/networks.enum';
import { BlockchainService } from './blockchain.service';
import {
  CreateWalletsDto,
  ImportWalletsFromMnemonicDto,
  IsAddressDto,
  TransferDto,
  TransferNftDto,
  TransferTokenDto,
} from './blockchain.dto';
import { IndexEnum } from '../network/enums/index.enum';
import { IndexTokenEnum } from '../tokenData/enums/indexToken.enum';
import { BooleanValidationPipe } from 'src/helpers/pipes/boolean-validate.pipe';
import { User } from 'src/helpers/decorators/user.decorator';
import { AuthGuard } from 'src/helpers/guards/auth.guard';
import { AuthPkGuard } from 'src/helpers/guards/auth-pk.guard';
import { UserPk } from 'src/helpers/decorators/user-pk.decorator';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // @Post('create-wallets')
  // createWallets(@User('id') userId: string, @Body() createWalletsDto: CreateWalletsDto) {
  //   return this.blockchainService.createWallets(userId, createWalletsDto);
  // }

  // @Post('import-wallets-from-mnemonic')
  // @HttpCode(HttpStatus.OK)
  // importWalletsFromMnemonic(@Body() importWalletsFromMnemonic: ImportWalletsFromMnemonicDto) {
  //   return this.blockchainService.importWalletsFromMnemonic(importWalletsFromMnemonic);
  // }

  @Post('is-address')
  @HttpCode(HttpStatus.OK)
  isAddress(@Body() isAddressDto: IsAddressDto) {
    return this.blockchainService.isAddress(isAddressDto);
  }

  @Get('balance/:userId')
  getBalance(@Param('userId') userId: string, @Query('network') network: IndexEnum) {
    return this.blockchainService.getBalance(userId, network);
  }

  @Get('balance-token/:userId')
  getBalanceToken(@Param('userId') userId: string, @Query('token') token: string) {
    return this.blockchainService.getBalanceToken(userId, token);
  }

  @Get('balances/:userId')
  @ApiQuery({ name: 'hasBalance', type: Boolean, required: false, description: 'Filter by balance status' })
  getBalances(
    @Param('userId') userId: string,
    @Query('hasBalance', new BooleanValidationPipe()) hasBalance: string | boolean,
  ) {
    return this.blockchainService.getBalances(userId, hasBalance as boolean);
  }

  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthPkGuard)
  @ApiBearerAuth()
  transfer(@UserPk() { user, privateKey }: { user: any; privateKey: string }, @Body() transferDto: TransferDto) {
    return this.blockchainService.transfer(user.id, privateKey, transferDto);
  }

  @Post('transfer-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthPkGuard)
  @ApiBearerAuth()
  transferToken(
    @UserPk() { user, privateKey }: { user: any; privateKey: string },
    @Body() transferTokenDto: TransferTokenDto,
  ) {
    return this.blockchainService.transferToken(user.id, privateKey, transferTokenDto);
  }

  // @Post('ft-transfer')
  // @HttpCode(HttpStatus.OK)
  // ftTransfer(@Body() ftTransferDto: FtTransferDto) {
  //   return this.blockchainService.ftTransfer(ftTransferDto);
  // }

  // @Post('transfer-nft')
  // @HttpCode(HttpStatus.OK)
  // transferNft(@Body() transferNftDto: TransferNftDto) {
  //   return this.blockchainService.transferNft(transferNftDto);
  // }
}
