import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ImportFromMnemonicDto, ImportFromPkDto } from './dto/auth.dto';
import { AuthGuard } from 'src/helpers/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('import-from-mnemonic')
  @HttpCode(HttpStatus.OK)
  importFromMnemonic(@Body() importFromMnemonicDto: ImportFromMnemonicDto) {
    return this.authService.importFromMnemonic(importFromMnemonicDto);
  }
}
