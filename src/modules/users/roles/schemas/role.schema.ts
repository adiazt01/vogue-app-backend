import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from '../permissions/schemas/permission.schema';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema()
export class Role extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false, default: false })
  isDefault: boolean;

  @Prop({
    type: [Types.ObjectId],
    ref: Permission.name,
    autopopulate: true,
  })
  permissions: Permission[];
}

export type RoleDocument = HydratedDocument<Role>;

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.post('findOneAndDelete', async function (doc: RoleDocument) {
  if (doc) {
    try {
      const userModel = this.model.db.model('User');
      await userModel.updateMany({ role: doc._id }, { $set: { role: null } });
    } catch (err) {
      console.error('Error removing role reference from users:', err);
    }
  }
});
