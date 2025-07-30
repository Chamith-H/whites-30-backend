import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PermissionDocument } from './permission.schema';
import { RoleType } from 'src/config/enums/user-management/role.enum';

export type RoleDocument = Role & Document;

@Schema()
export class Role {
  @Prop()
  number: number;

  @Prop()
  roleId: string;

  @Prop()
  name: string;

  @Prop()
  status: boolean;

  @Prop({ enum: RoleType })
  type: RoleType;

  @Prop()
  description: string;

  @Prop()
  userCount: number;

  @Prop({ type: [{ type: String, ref: 'Permission' }] })
  permissions: PermissionDocument['_id'][];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
