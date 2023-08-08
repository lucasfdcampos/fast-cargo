import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export type AccountType = {
  cnpj: string;
  jwtToken: string;
  platformCode: string;
  zipCode: string;
};

export const AccountData = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authInfo: AccountType = request.authInfo;

    if (!authInfo) {
      throw new NotFoundException('Algo deu errado com sua conta');
    }

    return authInfo;
  },
);
