import { InputType, Int, Field, ID } from '@nestjs/graphql';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

@InputType({
  description: 'Input for creating a new product',
})
export class CreateProductInput {
  @Field(() => String, { description: 'Product name' })
  @IsString()
  @MinLength(2)
  name: string;

  @Field(() => String, { description: 'Product description', nullable: true })
  @IsString()
  @MinLength(2)
  @IsOptional()
  description?: string;

  @Field(() => Int, { description: 'Product price' })
  @IsInt()
  @Min(0)
  price: number;

  @Field(() => Int, {
    description: 'Product stock',
    nullable: true,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  stock?: number;

  @Field(() => [ID], { description: 'Product tags', nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  tagsId?: string[];

  @Field(() => ID, { description: 'Product category' })
  @IsUUID()
  categoryId: string;
}
