import { registerEnumType } from "@nestjs/graphql";

export enum OTP_ACTION {
    RESET_PASSWORD = 'RESET_PASSWORD',
    CONFIRM_EMAIL = 'CONFIRM_EMAIL',
    DELETE_ACCOUNT = 'DELETE_ACCOUNT',
}

registerEnumType(OTP_ACTION, {
    name: 'OTP_ACTION',
    description: 'The action associated with the OTP, such as resetting password, confirming email, or deleting account',
});