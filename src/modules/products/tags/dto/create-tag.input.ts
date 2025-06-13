import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType({
  description: 'Input for creating a new tag',
})
export class CreateTagInput {
  @Field(() => String, { description: 'The name of the tag' })
  @IsString()
  name: string;
}
