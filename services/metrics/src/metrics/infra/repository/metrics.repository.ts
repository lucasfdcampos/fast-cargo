import { Injectable } from '@nestjs/common';
import { Quote } from 'src/common/entities/quote.entity';
import { MetricsRepository } from 'src/metrics/domain/repository/metrics.repository';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MetricsRepositoryImpl
  extends Repository<Quote>
  implements MetricsRepository
{
  constructor(private dataSource: DataSource) {
    super(Quote, dataSource.createEntityManager());
  }

  async getMetrics(lastQuotes?: number): Promise<Quote[]> {
    const query = this.createQueryBuilder('quote')
      .select('quote.name AS name')
      .addSelect('CAST(quote.price AS float) AS price')
      .orderBy('quote.createdAt', 'DESC');

    if (lastQuotes) {
      query.take(lastQuotes);
    }

    const metrics = await query.getRawMany();
    return metrics;
  }
}
