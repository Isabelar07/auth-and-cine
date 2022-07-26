import { PartialType } from '@nestjs/swagger';
import { CreateMoviesDto } from './create-movie.dto';

export class UpdateMovieDTO extends PartialType(CreateMoviesDto) {}
