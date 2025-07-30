import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDocument } from '../user-management/user.schema';

export type SapTestDocument = SapTest & Document;

@Schema()
export class SapTest {
  @Prop()
  stage: string;

  @Prop()
  DocNum: number;

  @Prop()
  ItemCode: string;

  @Prop()
  Batch: string;

  @Prop()
  Line: number;

  @Prop()
  CreationDate: string;

  @Prop()
  U_Approval: string;

  @Prop({ type: String, ref: 'User' })
  U_ActionedBy: UserDocument['_id'];

  @Prop()
  U_ActionedNote: string;

  @Prop()
  U_ActionedDate: Date;

  @Prop()
  U_ActionedWarehouse: string;

  @Prop()
  U_Round: number;
}

export const SapTestSchema = SchemaFactory.createForClass(SapTest);
