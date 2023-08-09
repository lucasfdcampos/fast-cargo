import {
  IsNotEmpty,
  Min,
  IsNumber,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class AddressDto {
  @IsNotEmpty()
  zipcode: string;
}

class VolumeDto {
  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  category: number;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  unitary_weight: number;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsOptional()
  sku: string;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @Min(0.1)
  @IsNumber()
  @IsNotEmpty()
  length: number;
}

class RecipientDto {
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}

export class CreateQuoteDto {
  @ValidateNested()
  @Type(() => RecipientDto)
  recipient: RecipientDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VolumeDto)
  volumes: VolumeDto[];
}
