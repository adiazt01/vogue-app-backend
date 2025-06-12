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

  async createMany(
    permissions: CreatePermissionInput[],
  ): Promise<PermissionDocument[]> {
    const results: PermissionDocument[] = [];

    for (const perm of permissions) {
      let found = await this.permissionModel.findOne({
        action: perm.action,
        resource: perm.resource,
      });
      if (!found) {
        found = await this.permissionModel.create(perm);
      }
      results.push(found);
    }

    return results;
  }
}
