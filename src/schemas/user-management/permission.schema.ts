import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission {
  @Prop()
  name: string;

  @Prop()
  permissionNo: number;

  @Prop()
  module: number;

  @Prop()
  section: number;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
