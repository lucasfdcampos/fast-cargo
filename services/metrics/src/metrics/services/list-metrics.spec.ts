import { Test, TestingModule } from '@nestjs/testing';
import { MetricsRepositoryInMemory } from '../../../test/repositories/in-memory-metrics-repository';
import { ListMetricsService } from './list-metrics.service';
import { MetricsRepositoryToken } from '../domain/repository/metrics.repository';
import { Quote } from '../../common/entities/quote.entity';
import { MetricsParam } from '../dto/metrics.param';
import { NotFoundException } from '@nestjs/common';
import { IMetricsSummary } from '../domain/interfaces/metrics.interface';

const mockQuotes: Quote[] = [
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

const mockSummary: IMetricsSummary = {
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

describe('ListMetricsService', () => {
  let listMetricsService: ListMetricsService;
  let metricsRepository: MetricsRepositoryInMemory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListMetricsService,
        {
          provide: MetricsRepositoryToken,
          useClass: MetricsRepositoryInMemory,
        },
      ],
    }).compile();

    listMetricsService = module.get<ListMetricsService>(ListMetricsService);
    metricsRepository = module.get(MetricsRepositoryToken);
  });

  it('should be defined', () => {
    expect(listMetricsService).toBeDefined();
    expect(metricsRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should return metrics summary', async () => {
      // Arrange
      const metricsParam: MetricsParam = {
        last_quotes: '5',
      };

      jest
        .spyOn(metricsRepository, 'getMetrics')
        .mockResolvedValueOnce(mockQuotes);

      // Act
      const result = await listMetricsService.execute(metricsParam);

      // Assert
      expect(result).toEqual(mockSummary);
    });

    it('should throw NotFoundException if no metrics found', async () => {
      // Arrange
      const metricsParam: MetricsParam = {
        last_quotes: '5',
      };

      jest.spyOn(metricsRepository, 'getMetrics').mockResolvedValue([]);

      // Assert
      await expect(listMetricsService.execute(metricsParam)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
