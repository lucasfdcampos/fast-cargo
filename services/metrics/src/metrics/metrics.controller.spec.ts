import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { ListMetricsService } from './services/list-metrics.service';
import { IMetricsSummary } from './domain/interfaces/metrics.interface';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { CanActivate, NotFoundException } from '@nestjs/common';
import { MetricsParam } from './dto/metrics.param';

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

describe('MetricsController', () => {
  let metricsController: MetricsController;
  let listMetricsService: ListMetricsService;

  beforeEach(async () => {
    const mockAuthorizationGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: ListMetricsService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockSummary),
          },
        },
      ],
    })
      .overrideGuard(AuthorizationGuard)
      .useValue(mockAuthorizationGuard)
      .compile();

    metricsController = module.get<MetricsController>(MetricsController);
    listMetricsService = module.get<ListMetricsService>(ListMetricsService);
  });

  it('should be defined', () => {
    expect(metricsController).toBeDefined();
    expect(listMetricsService).toBeDefined();
  });

  describe('listMetrics', () => {
    it('should return metrics summary', async () => {
      // Arrange
      const metricsParam: MetricsParam = {
        last_quotes: '5',
      };

      // Act
      const result = await metricsController.listMetrics(metricsParam);

      // Assert
      expect(result).toBe(mockSummary);
      expect(listMetricsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when no metrics are found', async () => {
      // Arrange
      const metricsParam: MetricsParam = {
        last_quotes: '5',
      };

      listMetricsService.execute = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException('Não foram encontradas métricas.'),
        );

      // Act and Assert
      await expect(metricsController.listMetrics(metricsParam)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
