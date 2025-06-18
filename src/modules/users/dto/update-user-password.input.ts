import { Field } from "@nestjs/graphql";
import { IsEmail, IsStrongPassword } from "class-validator";

export class UpdateUserPassowrdFromForgotPasswordInput {
    @Field(() => String, {
        description: "The new password for the user",
    })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @Field(() => String, {
        description: "The email of the user",
    })
    @IsEmail()
    email: string;
}