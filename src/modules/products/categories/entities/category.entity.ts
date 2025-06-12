import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
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
