import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import {
  BadRequestException,
  CanActivate,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuoteService } from './services/create-quote.service';
import {
  createQuoteDto,
  mockAccountData,
  mockCarrierInfo,
} from '../../test/mocks';

describe('QuoteController', () => {
  let quoteController: QuoteController;
  let createQuoteService: CreateQuoteService;

  beforeEach(async () => {
    const mockAuthorizationGuard: CanActivate = {
      canActivate: jest.fn(() => true),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [
        {
          provide: CreateQuoteService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockCarrierInfo),
          },
        },
      ],
    })
      .overrideGuard(AuthorizationGuard)
      .useValue(mockAuthorizationGuard)
      .compile();

    quoteController = module.get<QuoteController>(QuoteController);
    createQuoteService = module.get<CreateQuoteService>(CreateQuoteService);
  });

  it('should be defined', () => {
    expect(quoteController).toBeDefined();
    expect(createQuoteService).toBeDefined();
  });

  describe('create', () => {
    it('should return offer simulations on carriers info', async () => {
      // Act
      const result = await quoteController.create(
        createQuoteDto,
        mockAccountData,
      );

      // Assert
      expect(result).toBe(mockCarrierInfo);
    });

    it('should throw BadRequestException on bad request', async () => {
      // Arrange
      createQuoteService.execute = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Bad Request'));

      // Act and Assert
      await expect(
        quoteController.create(createQuoteDto, mockAccountData),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when no offers are found', async () => {
      // Arrange
      createQuoteService.execute = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException('Não foram encontradas ofertas'),
        );

      // Act and Assert
      await expect(
        quoteController.create(createQuoteDto, mockAccountData),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
