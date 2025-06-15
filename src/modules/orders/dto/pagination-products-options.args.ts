import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class PaginationOrdersOptionsArgs extends PaginationOptionsDto {
  @Field(() => String, {
    nullable: true,
    description: 'Filter orders by name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @Field(() => String, {
    nullable: true,
    description: 'Filter orders by slug',
  })
  @IsOptional()
  @IsString()
  slug?: string;
}
