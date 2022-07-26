import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';

@Entity('films')
export class MoviesEntity extends BaseEntity {
  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  releaseDate: string;

  @Column('varchar', { array: true, nullable: true })
  creators: string[];

  @Column('varchar', { array: true, nullable: true })
  directors: string[];

  @Column('varchar', { array: true, nullable: true })
  cast: string[];

  @Column('varchar', { array: true, nullable: true })
  genre: string[];

  //TODO: ver se string é melhor opção
  @Column({ nullable: true })
  durationInMinutes: string;

  @Column({ nullable: true })
  classification: string;
}
