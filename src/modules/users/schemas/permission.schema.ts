import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Resources } from '../enums/resources.enum';
import { ActionsPermissions } from '../enums/actions-permissions.enum';

@Schema()
export class Permission extends Document {
  @Prop({
    required: true,
    enum: Object.values(ActionsPermissions),
  })
  action: ActionsPermissions;

  @Prop({
    required: true,
    enum: Object.values(Resources),
  })
  resource: Resources;
}

export type PermissionDocument = Permission & Document;

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.index({ action: 1, resource: 1 }, { unique: true });
