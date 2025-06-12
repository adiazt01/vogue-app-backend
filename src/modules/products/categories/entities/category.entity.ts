import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType({
  description: 'Category entity represents a category in the product catalog',
})
export class Category {
  @Field(() => ID, { description: 'Unique identifier of the category' })
  _id: string;

  @Field(() => String, { description: 'Name of the category' })
  name: string;

  @Field(() => String, {
    description: 'Description of the category',
    nullable: true,
  })
  description?: string;
}
