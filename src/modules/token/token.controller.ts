import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TokenService } from './token.service';
import { TokenDto, UpdateTokenDto } from './dto/token.dto';
import { ApiKeyGuard } from 'src/helpers/guards/api-key.guard';

@ApiTags('Token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  create(@Body() createTokenDto: TokenDto) {
    return this.tokenService.create(createTokenDto);
  }

  @Get()
  findAll() {
    return this.tokenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tokenService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateTokenDto) {
    return this.tokenService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tokenService.remove(id);
  }
}
