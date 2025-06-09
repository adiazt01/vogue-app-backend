import { PaginationMetadataDtoParameters } from '@common/interfaces/pagination/pagination-metadata-dto-parameters.interface';
import { IsInt } from 'class-validator';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationMetadataDto {
  @Field(() => Int)
  @IsInt()
  readonly page: number;

  @Field(() => Int)
  @IsInt()
  readonly limit: number;

  @Field(() => Int)
  @IsInt()
  readonly totalItems: number;

  @Field(() => Int)
  @IsInt()
  readonly totalPages: number;

  constructor({
    paginationOptionsDto,
    itemCount,
  }: PaginationMetadataDtoParameters) {
    this.page = paginationOptionsDto.page;
    this.limit = paginationOptionsDto.take;
    this.totalItems = itemCount;
    this.totalPages = Math.ceil(itemCount / paginationOptionsDto.take);
  }
}
