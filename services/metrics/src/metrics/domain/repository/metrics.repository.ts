import { Quote } from 'src/common/entities/quote.entity';

export interface MetricsRepository {
  getMetrics(lastQuotes?: number): Promise<Quote[]>;
}

export const MetricsRepositoryToken = 'MetricsRepository';
