import { Field, InputType } from "@nestjs/graphql";
import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

@InputType()
export class createPaymentSessionInput {
    @Field(() => String, {
        description: 'The ID of the order to create a payment session for',
        nullable: false,
    })
    @IsMongoId()
    orderId: Types.ObjectId;
}