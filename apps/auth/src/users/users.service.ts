import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersEntity } from './users.entity';
import { usersError } from './users.error';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.usersRepository.findOne({
        where: { cpf: dto.cpf },
      });

      if (user) {
        throw new BadRequestException(usersError.USER_ALREADY_EXISTS);
      }

      const hashPassword = await bcrypt.hash(dto.password, 10);
      dto.password = hashPassword;

      const createdUser = await this.usersRepository.save(dto);
      const { password, ...result } = createdUser;
      return result;
    } catch (error) {
      Logger.log('@@@ ERROR CREATE USER', error);
      throw new BadRequestException(error);
    }
  }

  async findByClientId(client_id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { client_id },
      });

      if (!user) {
        throw new NotFoundException(usersError.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      Logger.error('@@@ ERROR FIND BY CLIENT ID', error);
      throw new InternalServerErrorException(error);
    }
  }
}
