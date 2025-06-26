import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { createPaymentSessionInput } from './dto/create-payment-session.input';
import { PaymentsService } from './payments.service';

@Resolver()
export class PaymentsResolver {
    constructor(
        private readonly paymentsService: PaymentsService,
    ) { }

    @Mutation(() => String, { description: 'Create Stripe payment session and return URL' })
    async createPaymentSession(
        @Args('createPaymentSessionInput') createPaymentSessionInput: createPaymentSessionInput,
    ) {
        const { url } = await this.paymentsService.createPaymentSession(createPaymentSessionInput);

        return url;
    }
    
    
}
