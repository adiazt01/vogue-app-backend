import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { NotImplementedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from '@auth/guards/abilities.guard';
import { CheckAbility } from '@auth/decorators/check-ability.decorator';
import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';
import { PaginatedProductsOutput } from './dto/paginated-products.output';
import { PaginationProductsOptionsArgs } from './dto/pagination-products-options.args';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.CREATE, RESOURCES.PRODUCTS)
  @Mutation(() => Product, {
    description: 'Create a new product',
  })
  createProduct(
    @Args('createProductInput') createProductInput: CreateProductInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.productsService.create(createProductInput, user.sub);
  }

  @Query(() => PaginatedProductsOutput, { name: 'products' })
  async findAll(
    @Args() paginationProductsOptionsArgs: PaginationProductsOptionsArgs,
  ) {
    return await this.productsService.findAll(paginationProductsOptionsArgs);
  }

  @Query(() => Product, { name: 'product' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.UPDATE, RESOURCES.PRODUCTS)
  @Mutation(() => Product)
  updateProduct(
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    throw new NotImplementedException();
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.DELETE, RESOURCES.PRODUCTS)
  @Mutation(() => Product)
  removeProduct(@Args('id', { type: () => String }) id: string) {
    throw new NotImplementedException();
  }
}
