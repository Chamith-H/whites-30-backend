import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GatePassDocument } from './gate-pass.schema';
import { UserDocument } from '../user-management/user.schema';

export type GatePassLineDocument = GatePassLine & Document;

@Schema()
export class GatePassLine {
  @Prop({ type: String, ref: 'GatePass' })
  gatePass: GatePassDocument['_id'];

  @Prop()
  gatePassId: string;

  @Prop()
  po: number;

  @Prop()
  itemCode: string;

  @Prop()
  uom: string;

  @Prop()
  checkedQty: string;

  @Prop()
  firstWeight: String;

  @Prop()
  secondWeight: String;

  @Prop()
  status: string;

  @Prop({ type: String, ref: 'User' })
  recordedBy: UserDocument['_id'];

  @Prop()
  recordedDate: Date;
}

export const GatePassLineSchema = SchemaFactory.createForClass(GatePassLine);
