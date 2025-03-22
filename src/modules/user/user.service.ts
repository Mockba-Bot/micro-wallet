import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ExceptionHandler } from 'src/helpers/handlers/exception.handler';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { GenerateOtpDto, UpdateUserDto, UserDto } from './dto/user.dto';
import { HttpCustomService } from 'src/shared/http/http.service';
import { JwtService } from '@nestjs/jwt';
import { UtilsShared } from 'src/shared/utils/utils.shared';
import { NotificationService } from '../notification/notification.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly httpService: HttpCustomService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async create(createUserDto: UserDto) {
    try {
      const user = await this.userRepository.create(createUserDto);

      try {
        const credentials = await this.blockchainService.createWallets(user.id, {
          mnemonic: createUserDto.mnemonic,
        });

        if (!credentials) {
          throw new InternalServerErrorException('Failed to create wallets');
        }

        const payload = {
          userId: user.id,
          mnemonic: createUserDto.mnemonic,
          credentials,
        };

        return {
          ...user,
          token: await this.jwtService.signAsync(payload, { expiresIn: '31d' }),
          credentials,
        };
      } catch (error) {
        await this.userRepository.remove(user.id);
        throw new ExceptionHandler(error);
      }
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async findAll(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async findOne(id: string): Promise<UserEntity> {
    try {
      const userFound = await this.userRepository.findOne(id);

      if (!userFound) {
        throw new NotFoundException('User not found');
      }

      return userFound;
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const userFound = await this.userRepository.findByEmail(email);

      if (!userFound) {
        throw new NotFoundException('User not found');
      }

      return userFound;
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    try {
      await this.userRepository.update(id, updateUserDto);

      return (await this.userRepository.findOne(id))!;
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      return await this.userRepository.remove(id);
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async generateOtp(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const otp = await UtilsShared.generateOtp();
      const otpExpiration = new Date(Date.now() + 60 * 60 * 1000);

      await this.userRepository.update(user.id, { otp, otpExpiration });

      await this.notificationService.sendOtp(email, otp, 'es');

      return;
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async validateOtp(email: string, otp: string): Promise<Partial<UserEntity>> {
    try {
      const user = await this.findByEmail(email);

      if (!user || !user.otpExpiration || user.otp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      if (new Date() > user.otpExpiration) {
        throw new BadRequestException('Invalid OTP');
      }

      await this.userRepository.update(user.id, { otp: null, otpExpiration: null });

      return { copydrive: user.copydrive };
    } catch (error) {
      throw new ExceptionHandler(error);
    }
  }

  async userExists(email: string): Promise<{ exists: boolean }> {
    const userFound = await this.userRepository.findByEmail(email);
    return { exists: !!userFound };
  }
}
