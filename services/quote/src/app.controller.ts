import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthorizationGuard } from './common/guards/authorization.guard';
import {
  AccountType,
  AccountData,
} from './common/decorators/account.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthorizationGuard)
  getHello(@AccountData() accountData: AccountType) {
    return this.appService.getHello(accountData);
  }
}
