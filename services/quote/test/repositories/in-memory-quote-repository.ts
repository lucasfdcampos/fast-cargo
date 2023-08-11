import { Injectable } from '@nestjs/common';
import { QuoteRepository } from 'src/quote/domain/repository/quote.repository';
import { Quote } from 'src/quote/entities/quote.entity';

@Injectable()
export class QuoteRepositoryInMemory implements QuoteRepository {
  private quotes: Quote[] = [];

  async saveMany(quotes: Quote[]): Promise<Quote[]> {
    this.quotes.push(...quotes);
    return quotes;
  }
}
