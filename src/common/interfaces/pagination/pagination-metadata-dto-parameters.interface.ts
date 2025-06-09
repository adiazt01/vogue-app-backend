import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';

export interface PaginationMetadataDtoParameters {
  paginationOptionsDto: PaginationOptionsDto;
  itemCount: number;
}
