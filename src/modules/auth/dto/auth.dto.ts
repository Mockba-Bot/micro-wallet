import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsNumber, IsEmail } from 'class-validator';

export class ImportFromMnemonicDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mnemonic: string;
}

export class ImportFromPkDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  privateKey: string;
}
