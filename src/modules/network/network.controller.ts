import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { NetworkService } from './network.service';
import { NetworkDto, UpdateNetworkDto } from './dto/network.dto';
import { ApiKeyGuard } from 'src/helpers/guards/api-key.guard';

@ApiTags('Network')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  create(@Body() createNetworkDto: NetworkDto) {
    return this.networkService.create(createNetworkDto);
  }

  @Get()
  findAll() {
    return this.networkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.networkService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateNetworkDto: UpdateNetworkDto) {
    return this.networkService.update(id, updateNetworkDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.networkService.remove(id);
  }
}
