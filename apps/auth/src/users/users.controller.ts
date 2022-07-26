import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { generalErrors } from '../common/general.errors';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersEntity } from './users.entity';
import { usersError } from './users.error';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: ' create new user' })
  @ApiResponse({ status: 201, type: UsersEntity })
  @ApiBadRequestResponse({ description: usersError.USER_ALREADY_EXISTS })
  @ApiNotFoundResponse({ description: usersError.USER_NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: generalErrors.INTERNAL_SERVER_ERROR,
  })
  async create(@Body() dto: CreateUserDto) {
    return await this.usersService.createUser(dto);
  }
}
