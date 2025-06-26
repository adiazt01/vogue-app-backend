import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order } from "@orders/schemas/order.schema";
import { User } from "@users/schemas/user.schema";
import { Document, HydratedDocument, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Payment extends Document {
    declare _id: string;

    @Prop({
        type: Types.ObjectId,
        ref: Order.name,
        required: true,
    })
    order: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        ref: User.name,
        required: true,
    })
    buyer: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
    })
    amount: number;

    @Prop({
        type: String,
        required: true,
    })
    currency: string;

    @Prop({
        type: String,
        required: true,
    })
    paymentMethod: string;

    @Prop({
        type: String,
        required: true,
    })
    providerPaymentId: string;
}

export type PaymentDocument = HydratedDocument<Payment>;

export const PaymentSchema = SchemaFactory.createForClass(Payment);