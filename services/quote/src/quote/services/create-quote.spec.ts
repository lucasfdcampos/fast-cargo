import { CreateQuoteService } from './create-quote.service';
import { QuoteRepositoryInMemory } from '../../../test/repositories/in-memory-quote-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { QuoteRepositoryToken } from '../domain/repository/quote.repository';
import {
  createQuoteDto,
  mockAccountData,
  mockCarrierInfo,
  mockResponse,
} from '../../../test/mocks';
import { Quote } from '../entities/quote.entity';

jest.mock('axios');

describe('CreateQuoteService', () => {
  let createQuoteService: CreateQuoteService;
  let quoteRepository: QuoteRepositoryInMemory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateQuoteService,
        {
          provide: QuoteRepositoryToken,
          useClass: QuoteRepositoryInMemory,
        },
      ],
    }).compile();

    createQuoteService = module.get<CreateQuoteService>(CreateQuoteService);
    quoteRepository = module.get(QuoteRepositoryToken);
  });

  it('should be defined', () => {
    expect(createQuoteService).toBeDefined();
    expect(quoteRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should return offer simulations on carriers info', async () => {
      // Arrange
      jest
        .spyOn(createQuoteService, 'postQuoteSimulate' as any)
        .mockResolvedValueOnce(mockResponse);

      // Act
      const result = await createQuoteService.execute(
        createQuoteDto,
        mockAccountData,
      );

      // Assert
      expect(result).toEqual(mockCarrierInfo);
    });

    it('should create and save quote instances', async () => {
      // Act
      const quoteInstances =
        createQuoteService.createQuoteInstances(mockCarrierInfo);

      jest
        .spyOn(quoteRepository, 'saveMany')
        .mockResolvedValueOnce(quoteInstances);

      // Assert
      expect(quoteInstances).toHaveLength(mockCarrierInfo.length);

      quoteInstances.forEach((quoteInstance, index) => {
        const mockCarrier = mockCarrierInfo[index];
        expect(quoteInstance.name).toBe(mockCarrier.name);
        expect(quoteInstance.service).toBe(mockCarrier.service);
        expect(quoteInstance).toBeInstanceOf(Quote);
      });
    });

    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(createQuoteService, 'postQuoteSimulate' as any)
        .mockResolvedValueOnce(mockResponse);

      jest
        .spyOn(createQuoteService, 'extractCarrierInfo' as any)
        .mockResolvedValueOnce(new Error());

      // Assert
      expect(
        createQuoteService.execute(createQuoteDto, mockAccountData),
      ).rejects.toThrowError();
    });
  });
});
