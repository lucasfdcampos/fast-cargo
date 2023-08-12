import { Quote } from '../../../common/entities/quote.entity';

export interface MetricsRepository {
  getMetrics(lastQuotes?: number): Promise<Quote[]>;
}

export const MetricsRepositoryToken = 'MetricsRepository';
