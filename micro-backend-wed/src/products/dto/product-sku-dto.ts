import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class ProductSkuDto {
  @IsString()
  @IsNotEmpty()
  skuName: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsNumber()
  @IsNotEmpty()
  validity: number;
  @IsBoolean()
  @IsNotEmpty()
  lifetime: boolean;
  @IsNotEmpty()
  skuCode?: string;
}
export class productSkuArrDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  skuDetails: ProductSkuDto[];
}
