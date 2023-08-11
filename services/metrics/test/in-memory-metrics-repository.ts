import { Injectable } from '@nestjs/common';
import { Quote } from 'src/common/entities/quote.entity';
import { MetricsRepository } from 'src/metrics/domain/repository/metrics.repository';

@Injectable()
export class MetricsRepositoryInMemory implements MetricsRepository {
  private quotes: Quote[] = [];

  async getMetrics(lastQuotes?: number): Promise<Quote[]> {
    if (lastQuotes) {
      const startIndex = Math.max(0, this.quotes.length - lastQuotes);
      return this.quotes.slice(startIndex);
    } else {
      return this.quotes;
    }
  }

  addQuote(quote: Quote): void {
    this.quotes.push(quote);
  }
}
