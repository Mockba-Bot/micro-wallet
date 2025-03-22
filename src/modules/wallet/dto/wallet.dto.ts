import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  network: string;
}

// export class WalletDto extends CreateWalletDto {
//   @ApiProperty()
//   @IsString()
//   @IsNotEmpty()
//   user: string;
// }

export class UpdateWalletDto extends PartialType(CreateWalletDto) {}

export class GetMnemonicDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mnemonic: string;
}
