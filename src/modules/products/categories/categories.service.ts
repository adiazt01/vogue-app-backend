import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { Model } from 'mongoose';
import { paginate } from '@common/utils/pagination/paginate.util';
import { PaginationCategoriesOptionsArgs } from './dto/pagination-categories-options.args';
import { PaginatedCategoriesOutput } from './dto/paginated-category.output';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryInput: CreateCategoryInput) {
    const existingCategory = await this.findOneByName(createCategoryInput.name);

    if (existingCategory) {
      throw new BadRequestException(
        `Category with name "${createCategoryInput.name}" already exists.`,
      );
    }

    const createdCategory = new this.categoryModel(createCategoryInput);

    return createdCategory.save();
  }

  async findOneByName(name: string): Promise<CategoryDocument | null> {
    return this.categoryModel.findOne({ name }).exec();
  }
  async findAll(
    paginationCategoriesOptionsArgs: PaginationCategoriesOptionsArgs,
  ): Promise<PaginatedCategoriesOutput> {
    return await paginate(this.categoryModel, paginationCategoriesOptionsArgs, {
      name: paginationCategoriesOptionsArgs.name,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryInput: UpdateCategoryInput) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
