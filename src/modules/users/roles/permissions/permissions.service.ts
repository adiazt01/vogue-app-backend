import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { CreatePermissionInput } from './dto/create-permission.input';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<PermissionDocument>,
  ) {}

  async create(permission: CreatePermissionInput) {
    const createdPermission = new this.permissionModel(permission);
    return await createdPermission.save();
  }

  async createMany(permissions: CreatePermissionInput[]) {
    return await this.permissionModel.insertMany(permissions);
  }
}
