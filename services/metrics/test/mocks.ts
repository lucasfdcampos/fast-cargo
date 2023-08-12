import { IMetricsSummary } from 'src/metrics/domain/interfaces/metrics.interface';
import { Quote } from '../src/common/entities/quote.entity';
import { MetricsParam } from 'src/metrics/dto/metrics.param';

export const mockQuotes: Quote[] = [
  {
    id: '1',
    name: 'UBER',
    service: 'Normal',
    deadline: '4',
    price: 58.95,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '2',
    name: 'CORREIOS',
    service: 'Normal',
    deadline: '5',
    price: 78.03,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '3',
    name: 'CORREIOS',
    service: 'PAC',
    deadline: '5',
    price: 92.45,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '4',
    name: 'BTU BRASPRESS',
    service: 'Normal',
    deadline: '5',
    price: 93.35,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '5',
    name: 'CORREIOS',
    service: 'SEDEX',
    deadline: '1',
    price: 162.68,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

export const mockMetricsParam: MetricsParam = {
  last_quotes: '5',
};

export const mockSummary: IMetricsSummary = {
  carriers: [
    {
      carrier: 'UBER',
      total_quotes: 1,
      total_price: 58.95,
      average_price: 58.95,
      cheapest_price: 58.95,
      highest_price: 58.95,
    },
    {
      carrier: 'CORREIOS',
      total_quotes: 3,
      total_price: 333.16,
      average_price: 111.05333333333334,
      cheapest_price: 78.03,
      highest_price: 162.68,
    },
    {
      carrier: 'BTU BRASPRESS',
      total_quotes: 1,
      total_price: 93.35,
      average_price: 93.35,
      cheapest_price: 93.35,
      highest_price: 93.35,
    },
  ],
  global_metrics: {
    average_price: 97.092,
    total_quotes: 5,
    total_price: 485.46,
    cheapest_price: 58.95,
    highest_price: 162.68,
  },
};

export const mockToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbnBqIjoiMjU0MzgyOTYwMDAxNTgifQ.maLLvC5ily7BSrnmsPN3kX6aUmWPd4nTGFTNS8K2jVE';
