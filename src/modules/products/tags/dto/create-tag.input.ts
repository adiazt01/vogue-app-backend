import { InputType, Field } from '@nestjs/graphql';

@InputType({
  description: 'Input for creating a new tag',
})
export class CreateTagInput {
  @Field(() => String, { description: 'The name of the tag' })
  name: string;
}
