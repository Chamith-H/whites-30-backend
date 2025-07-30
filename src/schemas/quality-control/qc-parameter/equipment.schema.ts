import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EquipmentDocument = Equipment & Document;

@Schema()
export class Equipment {
  @Prop()
  name: string;

  @Prop()
  code: string;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
