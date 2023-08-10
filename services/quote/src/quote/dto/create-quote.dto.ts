import {
  IsNotEmpty,
  Min,
  IsNumber,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AddressDto {
  @IsNotEmpty()
  @ApiProperty({ example: '01311000' })
  zipcode: string;
}

class VolumeDto {
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  category: number;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  amount: number;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 0.1 })
  unitary_weight: number;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 0.1 })
  price: number;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'abc-teste-123' })
  sku: string;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 0.1 })
  height: number;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 0.1 })
  width: number;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 0.1 })
  length: number;
}

class RecipientDto {
  @ValidateNested()
  @Type(() => AddressDto)
  @ApiProperty()
  address: AddressDto;
}

export class CreateQuoteDto {
  @ValidateNested()
  @Type(() => RecipientDto)
  @ApiProperty()
  recipient: RecipientDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VolumeDto)
  @ApiProperty({ type: [VolumeDto] })
  volumes: VolumeDto[];
}
