import { OTP_ACTION } from "@auth/enums/otp-action.enum";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
    description: 'Input type for sending an OTP to a user',
})
export class SendOtpInput {
    @Field(() => String, {
        description: 'The email address to which the OTP will be sent',
    })
    email: string;

    @Field(() => String, {
        description: 'The action for which the OTP is being sent, such as resetting password, confirming email, or deleting account',
    })
    action: OTP_ACTION;
}