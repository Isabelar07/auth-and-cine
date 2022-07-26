import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMoviesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  releaseDate: string;

  //TODO: colocar em json
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  creators: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  directors: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  cast: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  genre: string[];

  //TODO: ver se string é melhor opção
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  durationInMinutes: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  classification: string;
}
