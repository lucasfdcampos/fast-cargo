import { Test, TestingModule } from '@nestjs/testing';
import { MetricsRepositoryInMemory } from '../../../test/repositories/in-memory-metrics-repository';
import { ListMetricsService } from './list-metrics.service';
import { MetricsRepositoryToken } from '../domain/repository/metrics.repository';
import { NotFoundException } from '@nestjs/common';
import { mockMetricsParam, mockQuotes, mockSummary } from '../../../test/mocks';

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
      jest
        .spyOn(metricsRepository, 'getMetrics')
        .mockResolvedValueOnce(mockQuotes);

      // Act
      const result = await listMetricsService.execute(mockMetricsParam);

      // Assert
      expect(result).toEqual(mockSummary);
    });

    it('should throw NotFoundException if no metrics found', async () => {
      jest.spyOn(metricsRepository, 'getMetrics').mockResolvedValue([]);

      // Assert
      await expect(
        listMetricsService.execute(mockMetricsParam),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
