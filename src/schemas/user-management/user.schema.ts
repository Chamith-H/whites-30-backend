import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleDocument } from './role.schema';
import { UserType } from 'src/config/enums/user-management/user.enum';
import { TelInputStructure } from 'src/config/interfaces/tel-input.structure';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  number: number;

  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop()
  dob: string;

  @Prop()
  houseNo: string;

  @Prop()
  street: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  country: string;

  @Prop()
  zipCode: string;

  @Prop()
  verificationType: string;

  @Prop()
  verificationNumber: string;

  @Prop()
  gender: string;

  @Prop()
  description: string;

  @Prop({ type: String, ref: 'Role' })
  role: RoleDocument['_id'];

  @Prop({ type: Object })
  officeMobile: TelInputStructure;

  @Prop()
  officeEmail: string;

  @Prop()
  employeeId: string;

  @Prop()
  status: boolean;

  @Prop()
  profileImage: string;

  @Prop()
  type: UserType;

  @Prop()
  resetOtp: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
