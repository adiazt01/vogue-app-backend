import { InputType, Int, Field, ID } from '@nestjs/graphql';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateTagInput } from '../tags/dto/create-tag.input';
import { Type } from 'class-transformer';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

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

  @Field(() => [CreateTagInput], {
    description: 'Product tags',
    nullable: true,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTagInput)
  @IsArray()
  tags?: CreateTagInput[];

  @Field(() => ID, { description: 'Product category' })
  @IsString()
  @Type(() => ParseObjectIdPipe)
  categoryId: string;
}
