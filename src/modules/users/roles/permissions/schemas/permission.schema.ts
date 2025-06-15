import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ACTIONS_PERMISSIONS } from '../../../enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';

@Schema()
export class Permission extends Document {
  declare _id: Types.ObjectId;

  @Prop({
    required: true,
    enum: ACTIONS_PERMISSIONS,
  })
  action: ACTIONS_PERMISSIONS;

  @Prop({
    required: true,
    enum: RESOURCES,
  })
  resource: RESOURCES;
}

export type PermissionDocument = HydratedDocument<Permission>;

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.index({ action: 1, resource: 1 }, { unique: true });
