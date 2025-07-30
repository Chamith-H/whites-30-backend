import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QcParameterDocument } from '../qc-parameter/qc-parameter.schema';
import { UserDocument } from 'src/schemas/user-management/user.schema';
import { StageDocument } from '../stage/stage.schema';

export type QualityCheckingDocument = QualityChecking & Document;

@Schema()
export class QualityChecking {
  @Prop()
  name: string;

  @Prop()
  sampleNumber: number;

  @Prop()
  stageName: string;

  @Prop()
  docNum: string;

  @Prop()
  itemCode: string;
//ok
  @Prop()
  round: number;

  @Prop({ type: String, ref: 'Stage' })
  stage: StageDocument['_id'];

  @Prop({ type: String, ref: 'QcParameter' })
  parameter: QcParameterDocument['_id'];

  @Prop()
  observedValue: string;

  @Prop()
  inspectedDate: Date;

  @Prop({ type: String, ref: 'User' })
  inspectedBy: UserDocument['_id'];
}

export const QualityCheckingSchema =
  SchemaFactory.createForClass(QualityChecking);
