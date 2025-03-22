import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GenerateOtpDto, UpdateUserDto, UserDto, ValidateOtpDto } from './dto/user.dto';
import { ApiKeyGuard } from 'src/helpers/guards/api-key.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  create(@Body() createUserDto: UserDto) {
    return this.userService.create(createUserDto);
  }

  // @Post('import')
  // import(@Body() importUserDto: ImportUserDto) {
  //   return this.userService.import(importUserDto);
  // }

  @Get()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  @Post('generate-otp')
  async generateOtp(@Body() generateOtpDto: GenerateOtpDto) {
    return this.userService.generateOtp(generateOtpDto.email);
  }

  @Post('validate-otp')
  async validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
    return await this.userService.validateOtp(validateOtpDto.email, validateOtpDto.otp);
  }

  @Get('exists/:email')
  async userExists(@Param('email') email: string) {
    return await this.userService.userExists(email);
  }

  @Get(':id')
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }
}
