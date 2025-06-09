import { Model, FilterQuery } from 'mongoose';
import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';

export async function paginate<T>(
  model: Model<T>,
  paginationOptions: PaginationOptionsDto,
  filter: FilterQuery<T> = {},
) {
  const { page = 1, take = 10 } = paginationOptions;
  const skip = (page - 1) * take;

  const [items, totalItems] = await Promise.all([
    model.find(filter).skip(skip).limit(take).exec(),
    model.countDocuments(filter).exec(),
  ]);

  const meta = new PaginationMetadataDto({
    paginationOptionsDto: paginationOptions,
    itemCount: totalItems,
  });

  return { items, meta };
}
