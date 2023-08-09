import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'account' })
export class Account extends AbstractEntity {
  @Column()
  cnpj: string;

  @Column()
  token: string;

  @Column({ name: 'platform_code' })
  platformCode: string;

  @Column({ name: 'zip_code' })
  zipCode: string;
}
