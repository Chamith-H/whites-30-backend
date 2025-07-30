import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SapMasterDocument = SapMaster & Document;

@Schema()
export class SapMaster {
  @Prop()
  target: string;

  @Prop()
  name: string;

  @Prop()
  data: any[];
}

export const SapMasterSchema = SchemaFactory.createForClass(SapMaster);
