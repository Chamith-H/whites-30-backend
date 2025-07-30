import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WarehouseTestDocument = WarehouseTest & Document;

@Schema()
export class WarehouseTest {
  @Prop()
  WarehouseName: string;

  @Prop()
  WarehouseCode: string;

  @Prop()
  U_RejectWH: string;
}

export const WarehouseTestSchema = SchemaFactory.createForClass(WarehouseTest);
