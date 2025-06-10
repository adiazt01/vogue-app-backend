import { InputType, Field } from '@nestjs/graphql';
import { IsString, MaxLength, MinLength } from 'class-validator';

@InputType({
  description: 'Input type for creating a new category',
})
export class CreateCategoryInput {
  @Field(() => String, { description: 'Name of the category' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @Field(() => String, {
    description: 'Description of the category',
    nullable: true,
  })
  @IsString()
  @MaxLength(500)
  description?: string;
}
