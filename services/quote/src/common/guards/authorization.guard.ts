import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [, token] = request.headers.authorization?.split(' ');

    if (!token) {
      throw new UnauthorizedException('Token de autenticação não fornecido.');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.SECRET,
      });

      console.log('payload', payload);

      const { cnpj } = payload;

      const account = await this.accountRepository.findOne({
        where: {
          cnpj,
        },
      });

      if (!account) {
        throw new UnauthorizedException();
      }

      request.authInfo = {
        cnpj,
        jwtToken: account.token,
        platformCode: account.platformCode,
        zipCode: account.zipCode,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token de autorização inválido');
    }
  }
}
