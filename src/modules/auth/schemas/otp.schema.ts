import { OTP_ACTION } from "@auth/enums/otp-action.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "@users/schemas/user.schema";
import { HydratedDocument, Types } from "mongoose";

@Schema({
    timestamps: true,
})
export class Otp {
    declare _id: Types.ObjectId;

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: User.name,
    })
    user: Types.ObjectId;

    @Prop({
        type: String,
        required: true,
        description: 'The OTP code itself, usually a numeric string',
    })
    code: string;

    @Prop({
        type: String,
        required: true,
        enum: OTP_ACTION,
        description: 'The action associated with the OTP, such as resetting password, confirming email, or deleting account',
    })
    action: OTP_ACTION;

    @Prop({
        type: Date,
        required: true,
        description: 'The expiration date of the OTP, after which it is no longer valid',
    })
    expiresAt: Date;
}

export type OtpDocument = HydratedDocument<Otp>;

export const OtpSchema = SchemaFactory.createForClass(Otp);