import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { generalErrors } from './common/general.errors';
import { LocalAuthGuard } from './local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  @ApiOperation({ summary: ' authentication to access movies api' })
  @ApiBody({
    schema: {
      properties: {
        client_id: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      properties: {
        client_secret: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: generalErrors.UNAUTHORIZED })
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async loggedIn(data) {
    console.log('@@@@@@@@@@@@@@@', data);
    return this.authService.validateToken(data.jwt);
  }
}
