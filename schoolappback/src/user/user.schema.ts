import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/auth/models/role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true, unique: true })
  email: string;
  @Prop({ type: String, required: true })
  password: string;
  @Prop({ type: String, required: false, default: Role.STUDENT })
  role: string;
  @Prop({ type: Boolean, required: false, default: true  })
  enabled: boolean;
  @Prop({ type: String, required: false})
  hashedRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
