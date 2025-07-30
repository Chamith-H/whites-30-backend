import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemTestDocument = ItemTest & Document;

@Schema()
export class ItemTest {
  @Prop()
  ItemName: string;

  @Prop()
  ItemCode: string;
}

export const ItemTestSchema = SchemaFactory.createForClass(ItemTest);
