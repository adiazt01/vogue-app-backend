import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationOptionsDto {
  @Field(() => Int, {
    description: 'Current page number',
    defaultValue: 1,
    nullable: true,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @Field(() => Int, {
    description: 'Number of items per page',
    defaultValue: 10,
    nullable: true,
  })
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
