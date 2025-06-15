import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { OrderProduct } from "./entities/order-product.entity";
import { OrdersService } from "./orders.service";
import { User } from "@users/entities/user.entity";

@Resolver(() => OrderProduct)
export class OrdersProductResolver {
    constructor(
        private readonly ordersService: OrdersService,
    ) { }


    @ResolveField(() => User, {
        description: 'The seller of the product'
    })
    async seller(@Parent() orderProduct: OrderProduct): Promise<User> {
        console.log('Fetching seller for order product:', orderProduct);
        return this.ordersService.getSellerFromOrderProduct(orderProduct.product);
    }
}