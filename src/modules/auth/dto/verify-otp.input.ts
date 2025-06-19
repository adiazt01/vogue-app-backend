import { Field, InputType, PartialType, PickType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { OTP_ACTION } from "@auth/enums/otp-action.enum";
import { UpdateUserPasswordFromForgotPasswordInput } from "@users/dto/update-user-password.input";

@InputType({ description: "Input for verifying OTP" })
export class VerifyOtpInput extends PartialType(PickType(UpdateUserPasswordFromForgotPasswordInput, ["password"])) {
    @Field(() => String)
    otp: string;

    @Field(() => String, { description: "Email of the user" })
    @IsEmail()
    email: string;

    @Field(() => OTP_ACTION)
    action: OTP_ACTION;
}