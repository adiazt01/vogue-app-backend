import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Tag {
  @Field(() => ID, {
    description: 'unique identifier for the tag',
  })
  _id: string;

  @Field(() => String, { description: 'name of the tag' })
  name: string;

  @Field(() => String, {
    description: 'description of the tag',
    nullable: true,
  })
  description?: string;
}
