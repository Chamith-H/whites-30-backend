import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SapSessionDocument = SapSession & Document;

@Schema()
export class SapSession {
  @Prop()
  target: string;

  @Prop()
  sessionToken: string;

  @Prop()
  date: Date;
}

export const SapSessionSchema = SchemaFactory.createForClass(SapSession);
