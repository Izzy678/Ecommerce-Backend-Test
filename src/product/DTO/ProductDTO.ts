import { ApiProperty } from '@nestjs/swagger';
import { CurrencyEnum } from 'src/common/enum/CurrencyEnum';
import { ProductStatusEnum } from 'src/common/enum/ProductStatusEnum';

export class CreateProductDTO {
  @ApiProperty({
    example: 'product',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 100,
    required: true,
  })
  price: number;

  @ApiProperty({
    example: 5,
    required: true,
  })
  quantity: number;

  @ApiProperty({
    example: 'This is the product description',
    required: true,
  })
  description: string;

  @ApiProperty({
    example: 'USD',
    required: true,
    enum: Object.values(CurrencyEnum),
  })
  currency: CurrencyEnum;
}

export class UpdateProductDTO {
  @ApiProperty({
    example: 'product',
    required: false,
  })
  name: string;

  @ApiProperty({
    example: 100,
    required: false,
  })
  price: number;

  @ApiProperty({
    example: 5,
    required: false,
  })
  quantity: number;

  @ApiProperty({
    example: 'This is the product description',
    required: false,
  })
  description: string;

  @ApiProperty({
    example: 'USD',
    required: false,
    enum: Object.values(CurrencyEnum),
  })
  currency: CurrencyEnum;
}

export class GetProductPaginationDTO {
  @ApiProperty({
    example: 100,
    required: false,
  })
  limit: number;
  @ApiProperty({
    example: 1,
    required: false,
  })
  page: number;
}

export class DisAproveOrApproveProductDTO {
  @ApiProperty({
    example: ProductStatusEnum.Disapproved,
    required: true,
    enum: Object.values(ProductStatusEnum),
  })
  status: ProductStatusEnum;
}
