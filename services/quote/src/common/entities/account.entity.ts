import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'account' })
export class Account extends AbstractEntity {
  @Column()
  @ApiProperty()
  cnpj: string;

  @Column()
  @ApiProperty()
  token: string;

  @Column({ name: 'platform_code' })
  @ApiProperty()
  platformCode: string;

  @Column({ name: 'zip_code' })
  @ApiProperty()
  zipCode: string;
}
