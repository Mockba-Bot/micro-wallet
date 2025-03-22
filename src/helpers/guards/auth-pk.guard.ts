import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';
import { HttpService } from '@nestjs/axios';
import { HttpCustomService } from 'src/shared/http/http.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env';
dotenv.config();

@Injectable()
export class AuthPkGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token no encontrado');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return false;
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET', { infer: true }),
      });

      const credential = payload.credentials.find((c) => c.index === (req.body?.network || req.body?.fromNetwork));

      if (!credential) {
        throw new UnauthorizedException('Credencial no encontrada');
      }

      req['privateKey'] = credential.privateKey;
      req['user'] = payload;

      if (!req['privateKey'] || !req['user']) {
        throw new UnauthorizedException('Credencial no encontrada');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

// const request = context.switchToHttp().getRequest();
// const token = this.extractTokenFromHeader(request);
// if (!token) {
//   console.log('token not found');
//   throw new UnauthorizedException();
// }
// try {
//   const payload = await this.jwtService.verifyAsync(token, {
//     secret: process.env.JWT_SECRET,
//   });

//   request['client'] = payload;
// } catch (e: any) {
//   console.log('error');
//   console.log(e);
//   throw new UnauthorizedException();
// }
// return true;
// }

// private extractTokenFromHeader(request: Request): string | undefined {
// const [type, token] = request.headers.authorization?.split(' ') ?? [];
// return type === 'Bearer' ? token : undefined;
// }
