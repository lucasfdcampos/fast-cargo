import { ApiProperty } from '@nestjs/swagger';

export class HttpExceptionSwagger {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string[];

  @ApiProperty()
  error: string;
}
