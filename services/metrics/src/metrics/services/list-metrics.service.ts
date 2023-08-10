import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MetricsRepository,
  MetricsRepositoryToken,
} from '../domain/repository/metrics.repository';
import { MetricsParam } from '../dto/metrics.param';
import { IMetricsSummary } from '../domain/interfaces/metrics.interface';
import { Quote } from 'src/common/entities/quote.entity';

@Injectable()
export class ListMetricsService {
  constructor(
    @Inject(MetricsRepositoryToken)
    private readonly repo: MetricsRepository,
  ) {}

  async execute(query: MetricsParam): Promise<IMetricsSummary> {
    const metrics = await this.repo.getMetrics(Number(query.last_quotes));

    if (metrics.length === 0) {
      throw new NotFoundException('Não foram encontradas métricas.');
    }

    const metricsSummary = this.calculateMetrics(metrics);

    return metricsSummary;
  }

  private calculateMetrics(quotes: Quote[]): IMetricsSummary {
    const carriersMap = new Map<string, any>();
    let totalQuotes = 0;
    let totalPrice = 0;
    let cheapestPrice = Number.MAX_VALUE;
    let highestPrice = Number.MIN_VALUE;

    for (const quote of quotes) {
      const carrier = quote.name;
      const price = quote.price;

      totalQuotes++;
      totalPrice += price;
      cheapestPrice = Math.min(cheapestPrice, price);
      highestPrice = Math.max(highestPrice, price);

      if (carriersMap.has(carrier)) {
        const existingCarrier = carriersMap.get(carrier);
        existingCarrier.total_quotes++;
        existingCarrier.total_price += price;
        existingCarrier.prices.push(price);
      } else {
        carriersMap.set(carrier, {
          total_quotes: 1,
          total_price: price,
          prices: [price],
        });
      }
    }

    const carriersSummary = [];
    carriersMap.forEach((value, name) => {
      const avgPrice = value.total_price / value.total_quotes;
      carriersSummary.push({
        carrier: name,
        total_quotes: value.total_quotes,
        total_price: value.total_price,
        average_price: avgPrice,
        cheapest_price: Math.min(...value.prices),
        highest_price: Math.max(...value.prices),
      });
    });

    const globalMetrics = {
      average_price: totalPrice / totalQuotes,
      total_quotes: totalQuotes,
      total_price: totalPrice,
      cheapest_price: cheapestPrice,
      highest_price: highestPrice,
    };

    return {
      carriers: carriersSummary,
      global_metrics: globalMetrics,
    };
  }
}
