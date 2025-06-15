import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Category } from '../categories/entities/category.entity';
import { Tag } from '../tags/entities/tag.entity';
import { User } from '@users/entities/user.entity';

@ObjectType({
  description: 'Product entity',
})
export class Product {
  @Field(() => ID)
  _id: string;

  @Field(() => User)
  owner: User;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int)
  stock: number;

  @Field(() => Float)
  price: number;

  @Field(() => Category)
  category: Category;

  @Field(() => [Tag])
  tags: Tag[];
}
