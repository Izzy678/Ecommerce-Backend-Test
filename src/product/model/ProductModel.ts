import { schemaConfig } from 'src/common/db/dbSchemaConfig';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CurrencyEnum } from 'src/common/enum/CurrencyEnum';
import { ProductStatusEnum } from 'src/common/enum/ProductStatusEnum';

@Schema(schemaConfig)
export class Product {
  @Prop()
  name: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  description: string;

  @Prop({ enum: Object.values(CurrencyEnum) })
  currency: string;

  @Prop({
    enum: Object.values(ProductStatusEnum),
    default: ProductStatusEnum.Pending,
  })
  status: ProductStatusEnum;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string;

  @Prop({ type: Date })
  updatedAt: Date;
}

export type ProdDoc = Product & mongoose.Document;
export const ProductModel = SchemaFactory.createForClass(Product);
