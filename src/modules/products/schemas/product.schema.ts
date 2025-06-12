import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/schemas/tag.schema';
import { User } from '@users/schemas/user.schema';

@Schema({ timestamps: true })
export class Product extends Document {
  declare _id: string;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: Types.ObjectId | User;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({
    type: Number,
    default: 0,
  })
  stock: number;

  @Prop({ required: true })
  price: number;

  @Prop({
    type: Types.ObjectId,
    ref: Category.name,
    required: true,
  })
  category: Types.ObjectId | Category;

  @Prop({
    type: [{ type: Types.ObjectId, ref: Tag.name }],
    default: [],
  })
  tags: (Types.ObjectId | Tag)[];
}

export type ProductDocument = HydratedDocument<Product>;

export const ProductSchema = SchemaFactory.createForClass(Product);
