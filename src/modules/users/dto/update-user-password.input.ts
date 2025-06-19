import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsMongoId, IsStrongPassword } from "class-validator";
import { Types } from "mongoose";

@InputType({
    description: "Input type for updating user password from forgot password flow",
})
export class UpdateUserPasswordFromForgotPasswordInput {
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
        description: "The ID of the user",
    })
    @IsMongoId()
    id: Types.ObjectId;
}