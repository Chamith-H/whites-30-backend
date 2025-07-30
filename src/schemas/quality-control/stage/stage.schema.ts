import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QcParameterDocument } from '../qc-parameter/qc-parameter.schema';

export type StageDocument = Stage & Document;

@Schema()
export class Stage {
  @Prop()
  stageName: string;

  @Prop()
  itemCode: string;

  @Prop({ type: String, ref: 'QcParameter' })
  parameter: QcParameterDocument['_id'];

  @Prop()
  mandatory: boolean;

  @Prop()
  minValue: string;

  @Prop()
  maxValue: string;

  @Prop()
  stdValue: string;

  @Prop()
  status: boolean;
}

export const StageSchema = SchemaFactory.createForClass(Stage);
