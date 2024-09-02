import {  schemaConfig } from 'src/common/db/dbSchemaConfig';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AccountStatusEnum } from 'src/common/enum/AccountStatusEnum';
import { RoleEnum } from 'src/common/enum/RoleEnums';

@Schema(schemaConfig)
export class User {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: Object.values(AccountStatusEnum), default: AccountStatusEnum.Active })
  accountStatus: AccountStatusEnum;

  @Prop({ enum: Object.values(RoleEnum), default: RoleEnum.User })
  role: RoleEnum;

  @Prop()
  refreshToken: string;
}

export type UserDoc = User & mongoose.Document;
export const UserModel = SchemaFactory.createForClass(User);
