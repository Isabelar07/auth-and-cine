import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateMoviesDto } from './dtos/create-movie.dto';
import { UpdateMovieDTO } from './dtos/update-movie.dto';
import { MoviesEntity } from './movies.entity';
import { moviesErrors } from './movies.errors';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(MoviesEntity)
    private moviesRepository: Repository<MoviesEntity>,
  ) {}

  async createMovie(dto: CreateMoviesDto): Promise<MoviesEntity> {
    try {
      //TODO: validar se realmente esta inserindo uma data
      const movie = await this.moviesRepository.findOne({
        where: { title: dto.title },
      });

      if (movie) {
        throw new BadRequestException(moviesErrors.MOVIE_ALREADY_EXISTS);
      }

      return await this.moviesRepository.save(dto);
    } catch (error) {
      Logger.log('@@@ ERROR CREATE MOVIE', error);
      throw new InternalServerErrorException(error);
    }
  }

  async findAllMovies(dto: PaginationDto) {
    try {
      const skippedItems = (Number(dto.page) - 1) * Number(dto.offset) || 0;

      const limit = Number(dto.limit) || 100;

      const page = Number(dto.page) || 1;

      const movies = await this.moviesRepository.find({
        skip: skippedItems,
        take: limit,
      });

      const moviesCount = await this.moviesRepository.count();

      return {
        data: movies,
        page,
        pageCount: movies.length,
        totalCount: moviesCount,
      };
    } catch (error) {
      Logger.log('@@ ERROR FIND ALL MOVIE', error);
      throw new InternalServerErrorException(error);
    }
  }

  async findMovieById(id: number): Promise<MoviesEntity> {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id },
      });

      if (!movie) {
        throw new NotFoundException(moviesErrors.MOVIE_NOT_FOUND);
      }

      return movie;
    } catch (error) {
      Logger.log('@@ ERROR FIND ONE MOVIE', error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateMovie(id: number, dto: UpdateMovieDTO) {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id },
      });

      if (!movie) {
        throw new NotFoundException(moviesErrors.MOVIE_NOT_FOUND);
      }

      await this.moviesRepository.update(id, {
        title: dto.title,
        summary: dto.summary,
        releaseDate: dto.releaseDate,
        creators: dto.creators,
        directors: dto.directors,
        cast: dto.cast,
        genre: dto.genre,
        durationInMinutes: dto.durationInMinutes,
        classification: dto.classification,
      });

      return movie;
    } catch (error) {
      Logger.log('@@ ERROR UPDATE MOVIE', error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteMovie(id: number) {
    try {
      const movie = await this.moviesRepository.findOne({
        where: { id },
      });

      if (!movie) {
        throw new BadRequestException(moviesErrors.MOVIE_NOT_FOUND);
      }

      await this.moviesRepository.delete(id);
    } catch (error) {
      Logger.log('@@ ERROR DELETE MOVIE', error);
      throw new InternalServerErrorException(error);
    }
  }
}
