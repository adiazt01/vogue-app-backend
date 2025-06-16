import { Field, InputType } from "@nestjs/graphql";
import { IsJWT } from "class-validator";

@InputType({
    description: 'Input type for refreshing user authentication tokens',
})
export class RefreshTokenInput {
  @Field(() => String, {
    description: 'The refresh token to be used for generating a new access token',
  })
  @IsJWT()
  refreshToken: string;
}