import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from '../permissions/schemas/permission.schema';
import { Document, HydratedDocument, PopulatedDoc, Types } from 'mongoose';

@Schema()
export class Role extends Document {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false, default: false })
  isDefault: boolean;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Permission.name }],
    default: [],
  })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export type RoleDocumentOverride = {
  permissions: PopulatedDoc<Permission>;
};

export type RoleDocument = HydratedDocument<Role, RoleDocumentOverride>;

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
