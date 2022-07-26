import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UsersEntity } from './users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(client_id: string, password: string): Promise<any> {
    const user = await this.usersService.findByClientId(client_id);
    const comparePassword = await bcrypt.compare(password, user.password);
    if (user && comparePassword) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UsersEntity) {
    const payload = { client_id: user.client_id, sub: user.id };
    return {
      client_secret: this.jwtService.sign(payload),
    };
  }

  validateToken(jwt: string) {
    try {
      return this.jwtService.verify(jwt);
    } catch (error) {
      Logger.log('@@@ ERROR VALIDATE TOKEN', error);
      return false;
    }
  }
}
