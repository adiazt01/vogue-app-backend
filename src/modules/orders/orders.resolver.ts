import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { CheckAbility } from '@auth/decorators/check-ability.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { AbilitiesGuard } from '@auth/guards/abilities.guard';
import { ACTIONS_PERMISSIONS } from '@users/enums/actions-permissions.enum';
import { RESOURCES } from '@users/enums/resources.enum';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { User } from '@users/entities/user.entity';
import { OrderProduct } from './entities/order-product.entity';
import { PaginationOrdersOptionsArgs } from './dto/pagination-products-options.args';
import { Types } from 'mongoose';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.CREATE, RESOURCES.ORDERS)
  @Mutation(() => Order)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ordersService.create(createOrderInput, user.sub);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.READ, RESOURCES.ORDERS)
  @Query(() => [Order], { name: 'orders' })
  findAll(@Args() paginationOrdersOptionsArgs: PaginationOrdersOptionsArgs) {
    return this.ordersService.findAll(paginationOrdersOptionsArgs);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.READ, RESOURCES.ORDERS)
  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => String }) id: Types.ObjectId) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.UPDATE, RESOURCES.ORDERS)
  @Mutation(() => Order)
  updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput) {
    return this.ordersService.update(updateOrderInput.id, updateOrderInput);
  }

  @UseGuards(JwtAuthGuard, AbilitiesGuard)
  @CheckAbility(ACTIONS_PERMISSIONS.DELETE, RESOURCES.ORDERS)
  @Mutation(() => Order)
  removeOrder(@Args('id', { type: () => String }) id: Types.ObjectId) {
    return this.ordersService.remove(id);
  }

  @ResolveField(() => User, { name: 'buyer', description: 'The buyer of the order' })
  async getBuyer(@Parent() order: Order) {
    return this.ordersService.getBuyerFromOrder(order._id);
  }

  @ResolveField(() => [OrderProduct], { name: 'products', description: 'Products in the order' })
  async getProducts(@Parent() order: Order) {
    return this.ordersService.getProductsFromOrder(order._id);  
  }
}
