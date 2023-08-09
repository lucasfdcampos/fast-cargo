import { Entity, Column } from 'typeorm';
import { AbstractEntity } from 'src/common/entities/abstract.entity';

@Entity({ name: 'quote' })
export class Quote extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  service: string;

  @Column()
  deadline: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;
}
