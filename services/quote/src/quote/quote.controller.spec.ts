import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import {
  BadRequestException,
  CanActivate,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuoteService } from './services/create-quote.service';
import { CarrierInfo } from './interfaces/carrier.interface';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { AccountType } from '../common/decorators/account.decorator';

const mockData: CreateQuoteDto = {
  recipient: {
    address: {
      zipcode: '01311000',
    },
  },
  volumes: [
    {
      category: 7,
      amount: 1,
      unitary_weight: 5,
      price: 349,
      sku: 'abc-teste-123',
      height: 0.2,
      width: 0.2,
      length: 0.2,
    },
    {
      category: 7,
      amount: 2,
      unitary_weight: 4,
      price: 556,
      sku: 'abc-teste-527',
      height: 0.4,
      width: 0.6,
      length: 0.15,
    },
  ],
};

const mockAccountData: AccountType = {
  cnpj: '25438296000158',
  jwtToken: '1d52a9b6b78cf07b08586152459a5c90',
  platformCode: '5AKVkHqCn',
  zipCode: '29161-376',
};

const mockCarriers: CarrierInfo[] = [
  {
    name: 'UBER',
    service: 'Normal',
    deadline: '4',
    price: 58.95,
  },
  {
    name: 'CORREIOS',
    service: 'Normal',
    deadline: '5',
    price: 78.03,
  },
  {
    name: 'CORREIOS',
    service: 'PAC',
    deadline: '5',
    price: 92.45,
  },
  {
    name: 'BTU BRASPRESS',
    service: 'Normal',
    deadline: '5',
    price: 93.35,
  },
  {
    name: 'CORREIOS',
    service: 'SEDEX',
    deadline: '1',
    price: 162.68,
  },
];

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
            execute: jest.fn().mockResolvedValue(mockCarriers),
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
      const result = await quoteController.create(mockData, mockAccountData);

      // Assert
      expect(result).toBe(mockCarriers);
    });

    it('should throw BadRequestException on bad request', async () => {
      // Arrange
      createQuoteService.execute = jest
        .fn()
        .mockRejectedValue(new BadRequestException('Bad Request'));

      // Act and Assert
      await expect(
        quoteController.create(mockData, mockAccountData),
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
        quoteController.create(mockData, mockAccountData),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
