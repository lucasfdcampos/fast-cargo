import { Quote } from '../../../quote/entities/quote.entity';

export interface QuoteRepository {
  saveMany(quotes: Quote[]): Promise<Quote[]>;
}

export const QuoteRepositoryToken = 'QuoteRepository';
