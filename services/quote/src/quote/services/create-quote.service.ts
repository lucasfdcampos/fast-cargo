import { Injectable } from '@nestjs/common';
import { CustomHttp } from 'src/common/http/custom.http';
import { CreateQuoteDto } from '../dto/create-quote.dto';
import { AccountType } from 'src/common/decorators/account.decorator';

@Injectable()
export class CreateQuoteService {
  constructor(private readonly customHttp: CustomHttp) {}

  async execute(
    data: CreateQuoteDto,
    accountData: AccountType,
  ): Promise<CreateQuoteDto> {
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

    const { data: response } = await this.customHttp.post(
      `${process.env.INTEGRATION_URL}/quote/simulate`,
      request,
    );

    return response;
  }
}
