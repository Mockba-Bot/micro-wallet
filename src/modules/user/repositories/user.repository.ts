import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async save(entity: UserEntity): Promise<UserEntity> {
    return await this.repository.save(entity);
  }

  async create(userDto: UserDto): Promise<UserEntity> {
    const newEntity = this.repository.create(userDto);

    return await this.repository.save(newEntity);
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findOneBy({ email });
  }

  async update(id: string, updateData: Partial<UserEntity>): Promise<void> {
    const updateResult = await this.repository.update({ id }, updateData);
    if (updateResult.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.repository.delete({ id });
    if (deleteResult.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
