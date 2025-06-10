import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException(`Category with id "${id}" not found.`);
    }

    return category;
  }

  async update(id: string, updateCategoryInput: UpdateCategoryInput) {
    if (updateCategoryInput.name) {
      const existingCategory = await this.findOneByName(
        updateCategoryInput.name,
      );

      if (existingCategory && existingCategory.id !== id) {
        throw new BadRequestException(
          `Category with name "${updateCategoryInput.name}" already exists.`,
        );
      }
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryInput, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedCategory) {
      throw new NotFoundException(`Category with id "${id}" not found.`);
    }

    return updatedCategory;
  }

  async remove(id: string) {
    const deletedCategory = await this.findOne(id);

    if (!deletedCategory) {
      throw new NotFoundException(`Category with id "${id}" not found.`);
    }

    const result = await this.categoryModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Category with id "${id}" not found.`);
    }

    return deletedCategory;
  }
}
