import { Injectable } from '@nestjs/common';
import { AccountType } from './common/decorators/account.decorator';

@Injectable()
export class AppService {
  getHello(accountData: AccountType) {
    return { accountData };
  }
}
