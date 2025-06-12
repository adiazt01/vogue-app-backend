import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class PaginationProductsOptionsArgs extends PaginationOptionsDto {
  @Field(() => String, {
    nullable: true,
    description: 'Filter products by name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Filter products by slug',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}
