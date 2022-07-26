import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from '../common/mocks/mockRepository';
import { mockMovie } from './mocks/mockMovie';
import { MoviesEntity } from './movies.entity';
import { moviesErrors } from './movies.errors';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;
  let moviesEntity: MockRepository<MoviesEntity>;

  beforeEach(async () => {
    moviesEntity = new MockRepository<MoviesEntity>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(MoviesEntity),
          useValue: moviesEntity,
        },
      ],
    }).compile();

    module.useLogger(console);

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(jest.resetAllMocks);

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  describe('createMovie', () => {
    it('if a movie with the title already exists, it returns an error', async () => {
      moviesEntity.findOne.mockResolvedValue(mockMovie);

      await expect(service.createMovie(mockMovie)).rejects.toThrow(
        new NotFoundException(moviesErrors.MOVIE_ALREADY_EXISTS),
      );
    });

    it('if a movie with the title does not exist, it creates it', async () => {
      moviesEntity.findOne.mockResolvedValue(null);
      moviesEntity.save.mockResolvedValue(mockMovie);

      const result = await service.createMovie(mockMovie);

      expect(result).toEqual(mockMovie);
      expect(moviesEntity.save).toHaveBeenCalledWith(mockMovie);
    });

    it('if movie creation fails it should return internal server exception', async () => {
      moviesEntity.findOne.mockRejectedValue(
        new InternalServerErrorException('error'),
      );

      await expect(service.createMovie(mockMovie)).rejects.toThrow(
        new InternalServerErrorException('error'),
      );
    });
  });

  describe('findAllMovies', () => {
    it("if it doesn't find movies, it should return data with empty array", async () => {
      moviesEntity.find.mockResolvedValue([]);
      moviesEntity.count.mockResolvedValue(0);

      const result = await service.findAllMovies({});

      expect(result.data).toEqual([]);
      expect(result.page).toEqual(1);
      expect(result.pageCount).toEqual(0);
      expect(result.totalCount).toEqual(0);
    });

    it('if movies are found, it returns them', async () => {
      moviesEntity.find.mockResolvedValue([mockMovie]);
      moviesEntity.count.mockResolvedValue(2);

      const result = await service.findAllMovies({});

      expect(result).toEqual({
        data: [mockMovie],
        page: 1,
        pageCount: 1,
        totalCount: 2,
      });
    });

    it('if you pass pagination data by query, you must return pagination accordingly', async () => {
      moviesEntity.find.mockResolvedValue([mockMovie]);
      moviesEntity.count.mockResolvedValue(2);

      const result = await service.findAllMovies({
        page: 2,
        offset: 1,
        limit: 1,
      });

      expect(result).toEqual({
        data: [mockMovie],
        page: 2,
        pageCount: 1,
        totalCount: 2,
      });
    });

    it('if the fetch fails it should return an internal server exception', async () => {
      moviesEntity.find.mockRejectedValue(
        new InternalServerErrorException('error'),
      );
      moviesEntity.count.mockRejectedValue(
        new InternalServerErrorException('error'),
      );

      await expect(service.findAllMovies({})).rejects.toThrow(
        new InternalServerErrorException('error'),
      );
    });
  });

  describe('findMovieById', () => {
    it("if it doesn't find movie, it should return error", async () => {
      moviesEntity.findOne.mockResolvedValue(null);

      await expect(service.findMovieById(mockMovie.id)).rejects.toThrow(
        new NotFoundException(moviesErrors.MOVIE_NOT_FOUND),
      );
    });

    it('if it finds movie, it should return it', async () => {
      moviesEntity.findOne.mockResolvedValue(mockMovie);

      const result = await service.findMovieById(mockMovie.id);

      expect(result).toEqual(mockMovie);
    });

    it('if the fetch fails it should return an internal server exception', async () => {
      moviesEntity.findOne.mockRejectedValue(
        new InternalServerErrorException('error'),
      );

      await expect(service.findMovieById(mockMovie.id)).rejects.toThrow(
        new InternalServerErrorException('error'),
      );
    });
  });

  describe('updateMovie', () => {
    it("if it doesn't find the movie, it returns an error", async () => {
      moviesEntity.findOne.mockResolvedValue(null);

      await expect(
        service.updateMovie(mockMovie.id, mockMovie),
      ).rejects.toThrow(new NotFoundException(moviesErrors.MOVIE_NOT_FOUND));
    });

    it('if it finds the movie, it updates it', async () => {
      moviesEntity.findOne.mockResolvedValue(mockMovie);
      moviesEntity.update.mockResolvedValue(mockMovie);

      const result = await service.updateMovie(mockMovie.id, mockMovie);

      expect(result).toEqual(mockMovie);
      expect(moviesEntity.update).toBeCalled();
    });

    it('if the update fails it should return an internal server exception', async () => {
      moviesEntity.findOne.mockResolvedValue(mockMovie);
      moviesEntity.update.mockRejectedValue(
        new InternalServerErrorException('error'),
      );

      await expect(
        service.updateMovie(mockMovie.id, mockMovie),
      ).rejects.toThrow(new InternalServerErrorException('error'));
    });
  });

  describe('deleteMovie', () => {
    it("if it doesn't find the movie, it returns an error", async () => {
      moviesEntity.findOne.mockResolvedValue(null);

      await expect(service.deleteMovie(mockMovie.id)).rejects.toThrow(
        new NotFoundException(moviesErrors.MOVIE_NOT_FOUND),
      );
    });

    it('if you find the movie, you should delete it', async () => {
      moviesEntity.findOne.mockResolvedValue(mockMovie);
      moviesEntity.delete.mockResolvedValue(mockMovie);

      await service.deleteMovie(mockMovie.id);

      expect(moviesEntity.delete).toBeCalled();
    });

    it('if the delete fails it should return an internal server exception', async () => {
      moviesEntity.findOne.mockResolvedValue(mockMovie);
      moviesEntity.delete.mockRejectedValue(
        new InternalServerErrorException('error'),
      );

      await expect(service.deleteMovie(mockMovie.id)).rejects.toThrow(
        new InternalServerErrorException('error'),
      );
    });
  });
});
