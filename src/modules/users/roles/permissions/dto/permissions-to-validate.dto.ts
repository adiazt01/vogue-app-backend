import { InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';

export class PermissionToValidateDto {
  @IsArray()
  @ValidateNested()
  @Type(() => Types.ObjectId)
  permissionIds: Types.ObjectId[];
}
