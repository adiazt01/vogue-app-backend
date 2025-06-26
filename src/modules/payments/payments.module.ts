import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';
import { OrdersModule } from '@orders/orders.module';
import { OrdersService } from '@orders/orders.service';

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsResolver, PaymentsService, OrdersService]
})
export class PaymentsModule {}
