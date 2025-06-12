import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class PaginationTagsOptionsArgs extends PaginationOptionsDto {
  @Field(() => String, {
    nullable: true,
    description: 'Filter categories by name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
