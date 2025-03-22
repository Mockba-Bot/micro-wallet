import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env';
dotenv.config();

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly validApiKeys: string[] = [];

  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.validApiKeys.push(this.configService.get<string>('API_KEY')!);
  }

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();

    const apiKey = req.headers['x-api-key'];

    if (!apiKey || !this.validApiKeys.includes(apiKey as string)) {
      throw new UnauthorizedException('API Key Invalida');
    }

    return true;
  }
}
