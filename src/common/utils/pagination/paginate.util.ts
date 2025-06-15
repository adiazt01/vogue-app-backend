import { Model, FilterQuery, PopulateOptions } from 'mongoose';
import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';

export async function paginate<T>(
  model: Model<T>,
  paginationOptions: PaginationOptionsDto,
  filter: FilterQuery<T> = {},
  populate?: PopulateOptions | PopulateOptions[],
) {
  const { page = 1, take = 10 } = paginationOptions;
  const skip = (page - 1) * take;

  Object.keys(filter).forEach((key) => {
    if (!filter[key]) delete filter[key];
  });

  let query = model.find(filter).skip(skip).limit(take);

  if (populate) {
    query = query.populate(populate);
  }

  const [items, totalItems] = await Promise.all([
    query.exec(),
    model.countDocuments(filter).exec(),
  ]);

  const meta = new PaginationMetadataDto({
    paginationOptionsDto: paginationOptions,
    itemCount: totalItems,
  });

  console.log('Paginated items:', JSON.stringify(items, null, 2));
  console.log('Pagination metadata:', JSON.stringify(meta, null, 2));

  return { items, meta };
}
