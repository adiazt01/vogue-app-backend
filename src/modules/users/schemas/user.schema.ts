import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, PopulatedDoc, Types } from 'mongoose';
import { Role } from '../roles/schemas/role.schema';

@Schema({
  timestamps: true,
})
export class User extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  username: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Role.name }],
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocumentOverride = {
  roles: PopulatedDoc<Role>[];
};

export type UserDocument = HydratedDocument<User, UserDocumentOverride>;
