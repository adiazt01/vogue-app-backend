import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { OTP_ACTION } from "@auth/enums/otp-action.enum";

@InputType({ description: "Input for verifying OTP" })
export class VerifyOtpInput {
    @Field(() => String)
    otp: string;

    @Field(() => String, { description: "Email of the user" })
    @IsEmail()
    email: string;

    @Field(() => OTP_ACTION)
    action: OTP_ACTION;
}