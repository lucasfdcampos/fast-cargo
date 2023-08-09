import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomHttp } from 'src/common/http/custom.http';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { AccountType } from 'src/common/decorators/account.decorator';
import { CarrierInfo } from '../interfaces/carrier.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from '../entities/quote.entity';
import { Repository } from 'typeorm';
import { Dispatcher, Offer } from '../interfaces/quote.interface';

@Injectable()
export class CreateQuoteService {
  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    private readonly customHttp: CustomHttp,
  ) {}

  async execute(
    data: CreateQuoteDto,
    accountData: AccountType,
  ): Promise<CarrierInfo[]> {
    const request = this.buildQuoteRequest(data, accountData);

    const response = await this.postQuoteSimulate(request);

    const carrierInfo = this.extractCarrierInfo(response);

    const quoteInstances = this.createQuoteInstances(carrierInfo);

    await this.saveQuoteInstances(quoteInstances);

    return carrierInfo;
  }

  private buildQuoteRequest(data: CreateQuoteDto, accountData: AccountType) {
    const volumes = data.volumes.map((volume) => {
      return {
        amount: volume.amount,
        amount_volumes: 0,
        category: String(volume.category),
        sku: volume.sku,
        tag: '',
        description: '',
        height: volume.height,
        width: volume.width,
        length: volume.length,
        unitary_price: volume.price,
        unitary_weight: volume.unitary_weight,
        consolidate: false,
        overlaid: false,
        rotate: false,
      };
    });

    const totalPrice = data.volumes.reduce((acc, volume) => {
      return acc + volume.price;
    }, 0);

    const request = {
      shipper: {
        registered_number: accountData.cnpj,
        token: accountData.jwtToken,
        platform_code: accountData.platformCode,
      },
      recipient: {
        type: 0,
        registered_number: '07363994960',
        state_inscription: 'PR',
        country: 'BRA',
        zipcode: Number(data.recipient.address.zipcode.replace('-', '')),
      },
      dispatchers: [
        {
          registered_number: accountData.cnpj,
          zipcode: Number(accountData.zipCode.replace('-', '')),
          total_price: totalPrice,
          volumes: volumes,
        },
      ],
      channel: '',
      filter: 0,
      limit: 0,
      identification: '',
      reverse: false,
      simulation_type: [0],
      returns: {
        composition: false,
        volumes: false,
        applied_rules: false,
      },
    };

    return request;
  }

  private async postQuoteSimulate(request: any): Promise<Dispatcher> {
    const { data: response } = await this.customHttp.post(
      `${process.env.INTEGRATION_URL}/quote/simulate`,
      request,
    );

    return response;
  }

  private extractCarrierInfo(response: any): CarrierInfo[] {
    if (
      !response?.dispatchers.length ||
      !response?.dispatchers[0]?.offers.length
    ) {
      throw new HttpException(
        'Não foram encontradas ofertas para a rota informada.',
        HttpStatus.NOT_FOUND,
      );
    }

    const carrierInfo: CarrierInfo[] = response.dispatchers[0]?.offers.map(
      (offer: Offer) => {
        return {
          name: offer.carrier.name,
          service: offer.service,
          deadline: String(offer.delivery_time.days),
          price: offer.final_price,
        };
      },
    );

    return carrierInfo;
  }

  private createQuoteInstances(carrierInfo: CarrierInfo[]) {
    const quoteInstances = carrierInfo.map((info) => {
      const quoteInstance = new Quote();
      quoteInstance.name = info.name;
      quoteInstance.service = info.service;
      quoteInstance.deadline = info.deadline;
      quoteInstance.price = info.price;
      Object.assign(quoteInstance, info);

      return quoteInstance;
    });

    return quoteInstances;
  }

  private async saveQuoteInstances(quoteInstances: Quote[]): Promise<void> {
    await this.quoteRepository.save(quoteInstances);
  }
}
