import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from './permission.schema';
import { Document, Types } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Permission.name }],
    default: [],
  })
  permissions: Types.ObjectId[];
}

export type RoleDocument = Role & Document;

export const RoleSchema = SchemaFactory.createForClass(Role);
