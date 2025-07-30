import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EditLogDocument = EditLog & Document;

@Schema()
export class EditLog {
  @Prop()
  origin: string;

  @Prop()
  target: string;

  @Prop({ type: Object })
  updatedData: any;

  @Prop({ type: Object })
  data: any;

  @Prop()
  editBy: string;

  @Prop()
  editedDate: Date;
}

export const EditLogSchema = SchemaFactory.createForClass(EditLog);
