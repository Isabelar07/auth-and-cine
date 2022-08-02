import { Column, Entity, Generated } from 'typeorm';
import { BaseEntity } from '../common/entity/base.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  cpf: string;

  @Column({ nullable: true })
  @Generated('uuid')
  client_id: string;

  @Column({ nullable: true })
  password: string;
}
