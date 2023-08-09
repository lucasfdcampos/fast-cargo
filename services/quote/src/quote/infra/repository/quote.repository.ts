import { Injectable } from '@nestjs/common';
import { QuoteRepository } from 'src/quote/domain/repository/quote.repository';
import { Quote } from 'src/quote/entities/quote.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class QuoteRepositoryImpl
  extends Repository<Quote>
  implements QuoteRepository
{
  constructor(private dataSource: DataSource) {
    super(Quote, dataSource.createEntityManager());
  }

  async saveMany(quotes: Quote[]): Promise<Quote[]> {
    return await this.save(quotes);
  }
}
