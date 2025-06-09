import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from '../permissions/schemas/permission.schema';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({
    type: [Types.ObjectId],
    ref: Permission.name,
    autopopulate: true,
  })
  permissions: Permission[];
}

export type RoleDocument = HydratedDocument<Role>;

export const RoleSchema = SchemaFactory.createForClass(Role);
