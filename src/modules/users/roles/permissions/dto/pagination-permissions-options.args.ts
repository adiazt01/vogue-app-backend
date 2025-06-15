import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class PaginationRolesOptionsArgs extends PaginationOptionsDto {
  @Field(() => String, {
    nullable: true,
    description: 'Filter products by name',
  })
  @IsOptional()
  @IsString()
  name?: string;
}
