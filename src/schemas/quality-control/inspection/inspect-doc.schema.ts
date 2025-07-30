import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InspectDocDocument = InspectDoc & Document;

@Schema()
export class InspectDoc {
  @Prop()
  refId: string;

  @Prop()
  name: string;

  @Prop()
  fullPath: string;

  @Prop()
  path: string;

  @Prop()
  docId: string;

  @Prop()
  url: string;
}

export const InspectDocSchema = SchemaFactory.createForClass(InspectDoc);
