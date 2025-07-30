import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QcParameterDocument } from '../qc-parameter/qc-parameter.schema';

export type StageHeadDocument = StageHead & Document;

@Schema()
export class StageHead {
  @Prop()
  stageName: string;

  @Prop()
  itemCode: string;

  @Prop()
  method: string;

  @Prop()
  sampleCount: number;
}

export const StageHeadSchema = SchemaFactory.createForClass(StageHead);
