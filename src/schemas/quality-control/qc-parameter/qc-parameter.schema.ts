import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UomDocument } from './uom.schema';
import { EquipmentDocument } from './equipment.schema';

export type QcParameterDocument = QcParameter & Document;

@Schema()
export class QcParameter {
  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop({ type: String, ref: 'Uom' })
  uom: UomDocument['_id'];

  @Prop({ type: String, ref: 'Equipment' })
  equipment: EquipmentDocument['_id'];

  @Prop()
  category: string;

  @Prop()
  type: string;
}

export const QcParameterSchema = SchemaFactory.createForClass(QcParameter);
