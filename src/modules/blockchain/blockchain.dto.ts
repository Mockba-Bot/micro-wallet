import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { NetworksEnum } from '../network/enums/networks.enum';
import { IndexEnum } from '../network/enums/index.enum';
import { Type } from 'class-transformer';

export class CreateWalletsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mnemonic: string;
}

export class TransferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(IndexEnum)
  network: IndexEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class TransferTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(IndexEnum)
  network: IndexEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class IsAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(IndexEnum)
  network: IndexEnum;
}

export class ImportWalletsFromMnemonicDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mnemonic: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class TransferNftDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(IndexEnum)
  network: IndexEnum;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contract: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destination: string;
}
