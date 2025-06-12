import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
})
export class Tag extends Document {
  declare _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;
}

export type TagDocument = HydratedDocument<Tag>;

export const TagSchema = SchemaFactory.createForClass(Tag);
