import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SystemLogDocument = SystemLog & Document;

@Schema()
export class SystemLog {
  @Prop()
  origin: string;

  @Prop()
  target: string;

  @Prop({ type: Object })
  data: any;

  @Prop()
  createdBy: string;

  @Prop()
  createdDate: Date;
}

export const SystemLogSchema = SchemaFactory.createForClass(SystemLog);
