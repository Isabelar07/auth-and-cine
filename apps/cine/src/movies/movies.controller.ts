import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateMoviesDto } from './dtos/create-movie.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { MoviesEntity } from './movies.entity';
import { moviesErrors } from './movies.errors';
import { MoviesService } from './movies.service';

@ApiBearerAuth()
@ApiTags('Movies')
@UseGuards(AuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: ' create a poster movie' })
  @ApiBody({
    type: CreateMoviesDto,
  })
  @ApiResponse({ status: 201, type: MoviesEntity })
  @ApiNotFoundResponse({ description: moviesErrors.MOVIE_ALREADY_EXISTS })
  async create(@Body() dto: CreateMoviesDto) {
    return await this.moviesService.createMovie(dto);
  }

  @Get()
  @ApiOperation({ summary: ' get all movies' })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        data: { type: 'string' },
        page: { type: 'number' },
        pageCount: { type: 'number' },
        totalCount: { type: 'number' },
      },
    },
  })
  async findAll(@Query() dto?: PaginationDto) {
    return await this.moviesService.findAllMovies(dto);
  }

  @Get('/:id')
  @ApiOperation({ summary: ' get one movie' })
  @ApiResponse({ status: 200, type: MoviesEntity })
  async findOne(@Param('id') id: number) {
    return await this.moviesService.findMovieById(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: ' update a movie' })
  @ApiResponse({ status: 200 })
  @ApiNotFoundResponse({ description: moviesErrors.MOVIE_NOT_FOUND })
  async update(@Param('id') id: number, @Body() dto: UpdateMovieDTO) {
    return await this.moviesService.updateMovie(id, dto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: ' delete a movie' })
  @ApiNotFoundResponse({ description: moviesErrors.MOVIE_NOT_FOUND })
  async delete(@Param('id') id: number) {
    return await this.moviesService.deleteMovie(id);
  }
}
