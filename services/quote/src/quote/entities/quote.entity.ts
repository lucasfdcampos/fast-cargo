import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'quote' })
export class Quote extends AbstractEntity {
  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  service: string;

  @Column()
  @ApiProperty()
  deadline: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  @ApiProperty()
  price: number;
}
