import { CreateQuoteService } from './create-quote.service';
import { QuoteRepositoryInMemory } from '../../../test/repositories/in-memory-quote-repository';
import { Test, TestingModule } from '@nestjs/testing';
import { QuoteRepositoryToken } from '../domain/repository/quote.repository';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { AccountType } from 'src/common/decorators/account.decorator';
import { CarrierInfo } from '../interfaces/carrier.interface';
import { Quote } from '../entities/quote.entity';

// Mocking Axios
jest.mock('axios');

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

const mockResponse = {
  dispatchers: [
    {
      id: '64d602e074b9a9c8f3ae8bbc',
      request_id: '64d602e074b9a9c8f3ae8bbb',
      registered_number_shipper: '25438296000158',
      registered_number_dispatcher: '25438296000158',
      zipcode_origin: 29161376,
      offers: [
        {
          offer: 1,
          table_reference: '649c324f81d30f670798e6bd',
          simulation_type: 0,
          carrier: {
            name: 'UBER',
            registered_number: '17895646000187',
            state_inscription: '120.361.287.119',
            logo: 'https://s3.amazonaws.com/public.prod.freterapido.uploads/transportadora/foto-perfil/17895646000187.png',
            reference: 1647,
            company_name: 'UBER DO BRASIL TECNOLOGIA LTDA.',
          },
          service: 'Normal',
          delivery_time: {
            days: 4,
            estimated_date: '2023-08-17',
          },
          expiration: '2023-09-10T09:44:00.069700074Z',
          cost_price: 58.95,
          final_price: 58.95,
          weights: {
            real: 13,
            cubed: 24,
            used: 24,
          },
          original_delivery_time: {
            days: 4,
            estimated_date: '2023-08-17',
          },
        },
        {
          offer: 2,
          table_reference: '63b7fd854ed2f3f5dc78b4f5',
          simulation_type: 0,
          carrier: {
            name: 'CORREIOS',
            registered_number: '34028316000103',
            state_inscription: 'ISENTO',
            logo: '',
            reference: 281,
            company_name: 'EMPRESA BRASILEIRA DE CORREIOS E TELEGRAFOS',
          },
          service: 'Normal',
          delivery_time: {
            days: 5,
            hours: 19,
            minutes: 34,
            estimated_date: '2023-08-18',
          },
          expiration: '2023-09-10T09:44:00.069709495Z',
          cost_price: 78.03,
          final_price: 78.03,
          weights: {
            real: 13,
            used: 17,
          },
          correios: {},
          original_delivery_time: {
            days: 5,
            hours: 19,
            minutes: 34,
            estimated_date: '2023-08-18',
          },
        },
        {
          offer: 3,
          table_reference: '63098cb1907115d135576a43',
          simulation_type: 0,
          carrier: {
            name: 'CORREIOS',
            registered_number: '34028316000103',
            state_inscription: 'ISENTO',
            logo: 'https://s3.amazonaws.com/public.prod.freterapido.uploads/correios/correios-pac.jpg',
            reference: 281,
            company_name: 'EMPRESA BRASILEIRA DE CORREIOS E TELEGRAFOS',
          },
          service: 'PAC',
          service_code: '03298',
          service_description: 'PAC CONTRATO AG',
          delivery_time: {
            days: 5,
            estimated_date: '2023-08-18',
          },
          expiration: '2023-09-10T09:44:00.069724939Z',
          cost_price: 92.45,
          final_price: 92.45,
          weights: {
            real: 13,
            used: 17,
          },
          correios: {},
          original_delivery_time: {
            days: 5,
            estimated_date: '2023-08-18',
          },
        },
        {
          offer: 4,
          table_reference: '646b59b451f2b9d5942d250a',
          simulation_type: 0,
          carrier: {
            name: 'BTU BRASPRESS',
            registered_number: '48740351002702',
            state_inscription: '103898530',
            logo: 'https://s3.amazonaws.com/public.prod.freterapido.uploads/transportadora/foto-perfil/48740351002702.png',
            reference: 474,
            company_name: 'BRASPRESS TRANSPORTES URGENTES LTDA',
          },
          service: 'Normal',
          delivery_time: {
            days: 5,
            hours: 19,
            minutes: 34,
            estimated_date: '2023-08-18',
          },
          expiration: '2023-09-10T09:44:00.069712588Z',
          cost_price: 93.35,
          final_price: 93.35,
          weights: {
            real: 13,
            cubed: 16,
            used: 16,
          },
          original_delivery_time: {
            days: 5,
            hours: 19,
            minutes: 34,
            estimated_date: '2023-08-18',
          },
        },
        {
          offer: 5,
          table_reference: '63098cac907115d135576a3c',
          simulation_type: 0,
          carrier: {
            name: 'CORREIOS',
            registered_number: '34028316000103',
            state_inscription: 'ISENTO',
            logo: 'https://s3.amazonaws.com/public.prod.freterapido.uploads/correios/correios-sedex.jpg',
            reference: 281,
            company_name: 'EMPRESA BRASILEIRA DE CORREIOS E TELEGRAFOS',
          },
          service: 'SEDEX',
          service_code: '03220',
          service_description: 'SEDEX CONTRATO AG',
          delivery_time: {
            days: 1,
            estimated_date: '2023-08-14',
          },
          expiration: '2023-09-10T09:44:00.069723018Z',
          cost_price: 162.68,
          final_price: 162.68,
          weights: {
            real: 13,
            used: 17,
          },
          correios: {},
          original_delivery_time: {
            days: 1,
            estimated_date: '2023-08-14',
          },
        },
      ],
    },
  ],
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
        mockData,
        mockAccountData,
      );

      // Assert
      expect(result).toEqual(mockCarriers);
    });

    it('should create and save quote instances', async () => {
      // Act
      const quoteInstances =
        createQuoteService.createQuoteInstances(mockCarriers);

      jest
        .spyOn(quoteRepository, 'saveMany')
        .mockResolvedValueOnce(quoteInstances);

      // Assert
      expect(quoteInstances).toHaveLength(mockCarriers.length);

      quoteInstances.forEach((quoteInstance, index) => {
        const mockCarrier = mockCarriers[index];
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
        createQuoteService.execute(mockData, mockAccountData),
      ).rejects.toThrowError();
    });
  });
});
