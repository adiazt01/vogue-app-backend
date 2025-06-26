import { Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { envs } from '@config/env.config';
import { OrdersService } from '@orders/orders.service';
import { Types } from 'mongoose';
import { createPaymentSessionInput } from './dto/create-payment-session.input';

@Injectable()
export class PaymentsService {
    private readonly stripe = new Stripe(envs.STRIPE_SECRET_KEY);

    constructor(private readonly ordersService: OrdersService) { }

    async createPaymentSession(createPaymentSessionInput: createPaymentSessionInput) {
        const { orderId } = createPaymentSessionInput;

        const order = await this.ordersService.findOne(orderId);

        if (!order) {
            throw new NotFoundException(`Order not found with ID ${orderId}`);
        }

        const line_items = order.products.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                    description: item.product.description,
                },
                unit_amount: Math.round(item.product.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await this.stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {
                    orderId: order._id.toString(),
                },
            },
            line_items,
            mode: 'payment',
            success_url: `${envs.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${envs.FRONTEND_URL}/cancel`,
        });

        return { url: session.url };
    }
}