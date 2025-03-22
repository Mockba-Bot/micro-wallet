import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { TokenDataService } from './tokenData.service';
import { TokenDataDto, UpdateTokenDataDto } from './dto/tokenData.dto';
import { ApiKeyGuard } from 'src/helpers/guards/api-key.guard';

@ApiTags('TokenData')
@Controller('token-data')
export class TokenDataController {
  constructor(private readonly tokenDataService: TokenDataService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  create(@Body() createTokenDataDto: TokenDataDto) {
    return this.tokenDataService.create(createTokenDataDto);
  }

  @Get()
  findAll() {
    return this.tokenDataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tokenDataService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateTokenDataDto) {
    return this.tokenDataService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tokenDataService.remove(id);
  }
}
