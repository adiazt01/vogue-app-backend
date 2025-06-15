import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import { CategoriesService } from './categories/categories.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';
import { TagsService } from './tags/tags.service';
import { PaginationProductsOptionsArgs } from './dto/pagination-products-options.args';
import { paginate } from '@common/utils/pagination/paginate.util';
import { LoggerService } from '@common/logger/logger.service';
import { UpdateStockProductInput } from './dto/update-stock-product.input';
import { ValidateProductsAndStock } from './dto/validate-products-and-stock.dto';

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
    );
  }

  async validateProductsAndStock(
    validateProductsAndStockInput: ValidateProductsAndStock,
  ) {
    const { products } = validateProductsAndStockInput;

    const productsIds = products.map((p) => p.productId);

    const productsFound = await this.productModel
      .find({ _id: { $in: productsIds } })
      .select('*')
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

  async reduceStock(
    reduceStockInput: UpdateStockProductInput,
    session?: ClientSession | null,
  ) {
    const { productId, quantity } = reduceStockInput;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const productFound = await this.productModel
      .findById(productId)
      .session(session ?? null);

    if (!productFound) {
      throw new NotFoundException(
        `Product with ID ${productId.toString()} not found`,
      );
    }

    if (productFound.stock < quantity) {
      throw new BadRequestException(
        `Insufficient stock for product ${productId.toString()}. Available stock: ${productFound.stock}`,
      );
    }

    productFound.stock -= quantity;
    await productFound.save({ session });

    this.loggerService.info(
      `Stock reduced for product ${productId.toString()}, new stock: ${productFound.stock}`,
    );

    return productFound;
  }

  async updateStock(
    updateStockProduct: UpdateStockProductInput,
    userId: Types.ObjectId,
  ) {
    const { productId, quantity } = updateStockProduct;

    if (quantity < 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const productFound = await this.productModel.findOne({
      _id: productId,
      owner: userId,
    });

    if (!productFound) {
      throw new NotFoundException(
        `Product with ID ${productId.toString()} not found`,
      );
    }

    productFound.stock += quantity;
    await productFound.save();

    this.loggerService.info(
      `Stock updated for product ${productId.toString()}, new stock: ${productFound.stock}`,
    );

    return productFound;
  }

  async update(userId: string, updateProductInput: UpdateProductInput) {}

  remove(id: number) {
    throw new NotImplementedException();
  }

  // Resolvers field
  async findProductOwner(ownerId:  string) {
    this.loggerService.debug(`Finding owner for product id: ${ownerId}`);
    const productFound = await this.productModel
      .findById(ownerId)
      .populate('owner');

    if (!productFound) {
      throw new NotFoundException(`Product id ${ownerId} is not valid`);
    }

    return productFound.owner;
  }

  async findProductCategory(categoryId: string) {
    const productFound = await this.productModel
      .findById(categoryId)
      .populate('category');

    if (!productFound) {
      throw new NotFoundException(`Product id ${categoryId} is not valid`);
    }

    return productFound.category;
  }

  async findProductTags(tagsIds: string[]) {
    const tagsFound = await this.productModel
      .find({ _id: { $in: tagsIds } })
      .populate('tags');

    if (tagsFound.length !== tagsIds.length) {
      throw new NotFoundException(
        `Some tag ids are not valid: ${tagsIds.join(', ')}`,
      );
    }

    return tagsFound;
  }
}
