import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class MetricsParam {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({ example: '5' })
  last_quotes?: string;
}
