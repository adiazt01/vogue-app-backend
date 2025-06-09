import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from './role.schema';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: Role.name,
      },
    ],
  })
  roles: Types.ObjectId[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
