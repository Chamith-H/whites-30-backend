import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserDocument } from '../user-management/user.schema';

export type GatePassDocument = GatePass & Document;

@Schema()
export class GatePass {
  @Prop()
  number: number;

  @Prop()
  gatePassId: string;

  @Prop()
  driverName: string;

  @Prop()
  driverNic: string;

  @Prop()
  driverLicense: string;

  @Prop({ type: Object })
  driverMobile: any;

  @Prop()
  vehicleType: string;

  @Prop()
  vehicleNumber: string;

  @Prop()
  description: string;

  @Prop()
  po: number;

  @Prop()
  lineItems: any[];

  @Prop()
  state: string;

  @Prop({ type: String, ref: 'User' })
  createdBy: UserDocument['_id'];

  @Prop()
  createdDate: Date;
}

export const GatePassSchema = SchemaFactory.createForClass(GatePass);
