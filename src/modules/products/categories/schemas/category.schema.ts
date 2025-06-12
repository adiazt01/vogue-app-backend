import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Category extends Document {
  declare _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    required: false,
  })
  description?: string;
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ name: 1 }, { unique: true });
