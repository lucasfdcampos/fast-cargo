import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CustomHttp {
  /**
   * @description
   * Este método é usado para fazer requisições POST
   * Ele recebe a URL e data (request data) como parâmetro.
   * Alguns campos desse objeto são obrigatórios, como mostrado no exemplo abaixo.
   *
   * @example
   * const data = await this.customHttp.post(
   *   url: 'http://url/api/endpoint', ** obrigatório
   *   data: {
   *     email: 'email@email.com',
   *     name: 'Nome',
   *   }, ** obrigatório
   * ;
   *
   * @param url String url da api/rota
   * @param data Dados da request
   * @returns Uma promise com os dados de resposta do endpoint
   */
  async post(url: string, data: any): Promise<any> {
    if (!url) {
      throw new Error('A URL é obrigatória');
    }

    try {
      const response = await axios.post(url, data);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new HttpException(
            error.response.data.error,
            error.response.status,
          );
        } else if (error.request) {
          throw new HttpException(
            'Nenhuma resposta recebida do servidor',
            HttpStatus.NOT_FOUND,
          );
        } else {
          throw new HttpException(
            'Erro ao configurar a requisição',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      throw new BadRequestException('Ocorreu um erro inesperado');
    }
  }
}