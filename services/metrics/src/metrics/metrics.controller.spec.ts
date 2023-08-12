import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from './metrics.controller';
import { ListMetricsService } from './services/list-metrics.service';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { CanActivate, NotFoundException } from '@nestjs/common';
import { mockMetricsParam, mockSummary } from '../../test/mocks';

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
      // Act
      const result = await metricsController.listMetrics(mockMetricsParam);

      // Assert
      expect(result).toBe(mockSummary);
      expect(listMetricsService.execute).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when no metrics are found', async () => {
      listMetricsService.execute = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException('Não foram encontradas métricas.'),
        );

      // Act and Assert
      await expect(
        metricsController.listMetrics(mockMetricsParam),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
