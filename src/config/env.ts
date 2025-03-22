import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsIn, IsInt, IsNumber, IsString } from 'class-validator';
import { EnvironmentEnum } from '../shared/enums/environment.enum';
import { NearEnvEnum } from 'src/shared/enums/nearenv.enum';

export class EnvironmentVariables {
  @IsEnum(EnvironmentEnum)
  NODE_ENV: EnvironmentEnum;

  @IsEnum(NearEnvEnum)
  NEAR_ENV: NearEnvEnum;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  API_KEY!: string;

  @IsInt()
  PORT!: number;

  @IsString()
  HOST_ORM!: string;

  @IsString()
  DATABASE_ORM!: string;

  @IsString()
  USER_ORM!: string;

  @IsString()
  PASSWORD_ORM!: string;

  @IsInt()
  PORT_ORM!: number;

  @IsString()
  INFURA_PROJECT_ID: string;

  @IsString()
  ARBITRUM_NETWORK: string;

  @IsString()
  MAIL_HOST!: string;

  @IsString()
  MAIL_USER!: string;

  @IsString()
  MAIL_PASSWORD!: string;

  @IsString()
  MAIL_FROM!: string;
}
