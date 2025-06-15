import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from './categories/categories.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { TagsService } from './tags/tags.service';
import { PaginationProductsOptionsArgs } from './dto/pagination-products-options.args';
import { paginate } from '@common/utils/pagination/paginate.util';
import { LoggerService } from '@common/logger/logger.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly tagsService: TagsService,
    private readonly loggerService: LoggerService,
  ) {}

  async create(createProductInput: CreateProductInput, userId: string) {
    const { name, price, description, categoryId, stock, tags } =
      createProductInput;

    const isProductNameTaken = await this.isProductNameTaken(userId, name);

    if (isProductNameTaken)
      throw new BadRequestException(`Product name ${name} already exists`);

    const categoryFound = await this.categoriesService.findOne(categoryId);

    if (!categoryFound)
      throw new BadRequestException(`Category id ${categoryId} is not valid`);

    if (!tags) throw new BadRequestException(`Tags are required`);

    const tagsValidatesAndCreated =
      await this.tagsService.createOrFindTags(tags);

    const createdProduct = await this.productModel.create({
      owner: userId,
      name,
      price,
      description,
      category: categoryFound._id,
      stock,
      tags: tagsValidatesAndCreated.map((tag) => tag._id),
    });

    this.loggerService.info(`New product created: ${createdProduct._id}`);

    const newProductFounded = await this.productModel
      .findById(createdProduct._id)
      .populate(['owner', 'category', 'tags']);

    return newProductFounded;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) throw new NotFoundException(`Product id ${id} is not valid`);

    return product;
  }

  async findAll(paginationProductsOptionsArgs: PaginationProductsOptionsArgs) {
    return await paginate(
      this.productModel,
      {
        page: paginationProductsOptionsArgs.page,
        take: paginationProductsOptionsArgs.take,
      },
      {
        name: paginationProductsOptionsArgs.name,
      },
      [
        {
          path: 'owner',
        },
        {
          path: 'category',
        },
        {
          path: 'tags',
        },
      ],
    );
  }

  async validateProductsAndStock(
    products: { productId: string; quantity: number }[],
  ) {
    const productsIds = products.map((p) => p.productId);

    const productsFound = await this.productModel
      .find({ _id: { $in: productsIds } })
      .select('*')
      .populate(['owner', 'category'])
      .lean();

    if (productsFound.length !== productsIds.length) {
      throw new NotFoundException(
        `Some product ids are not valid: ${productsIds.join(', ')}`,
      );
    }

    const insufficientStock = productsFound.filter((product) => {
      const productInOrder = products.find(
        (p) => p.productId.toString() === product._id.toString(),
      );
      return productInOrder && product.stock < productInOrder.quantity;
    });

    if (insufficientStock.length > 0) {
      throw new BadRequestException(
        `Insufficient stock for products: ${insufficientStock
          .map((p) => p._id)
          .join(', ')}`,
      );
    }

    return productsFound;
  }

  async isProductNameTaken(userId: string, name: string) {
    return await this.productModel.findOne({
      userId,
      name,
    });
  }

  async update(userId: string, updateProductInput: UpdateProductInput) {}

  remove(id: number) {
    throw new NotImplementedException();
  }
}
