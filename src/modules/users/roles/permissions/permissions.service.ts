import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schemas/permission.schema';
import { Model } from 'mongoose';
import { CreatePermissionInput } from './dto/create-permission.input';
import { LoggerService } from '@common/logger/logger.service';
import { PermissionToValidateDto } from './dto/permissions-to-validate.dto';
import { Types } from 'mongoose';
import { PaginationPermissionsOptionsArgs } from '../dto/pagination-roles-options.args';
import { paginate } from '@common/utils/pagination/paginate.util';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
    private readonly loggerService: LoggerService,
  ) {}

  async create(permission: CreatePermissionInput) {
    const createdPermission = new this.permissionModel(permission);

    this.loggerService.log(
      `Creating permission with action: ${permission.action}, resource: ${permission.resource}`,
    );

    return await createdPermission.save();
  }

  async createMany(permissions: CreatePermissionInput[]) {
    const results: Permission[] = [];

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

    for (const result of results) {
      this.loggerService.log(
        `Permission created with action: ${result.action}, resource: ${result.resource}`,
      );

      return results;
    }
  }

  async findAll(
    paginationPermissionsOptions: PaginationPermissionsOptionsArgs,
  ) {
    return await paginate(this.permissionModel, {
      ...paginationPermissionsOptions,
    });
  }

  async findOne(id: Types.ObjectId) {
    const permission = await this.permissionModel.findById(id).exec();

    if (!permission)
      throw new NotFoundException(
        `Permission with ID ${id.toString()} not found`,
      );

    this.loggerService.log(
      `Found permission with action: ${permission.action}, resource: ${permission.resource}`,
    );

    return permission;
  }

  async findOneByActionAndResource(
    action: string,
    resource: string,
  ): Promise<PermissionDocument | null> {
    this.loggerService.log(
      `Finding permission with action: ${action}, resource: ${resource}`,
    );

    return this.permissionModel.findOne({ action, resource }).exec();
  }

  async validatePermissions(permissionsToValidate: PermissionToValidateDto) {
    const { permissionIds } = permissionsToValidate;

    const results: PermissionDocument[] = [];

    for (const permId of permissionIds) {
      const permissionFounded = await this.findOne(permId);

      results.push(permissionFounded);
    }

    this.loggerService.log(
      `Validated permissions: ${results.map((p) => p.action).join(', ')}`,
    );

    return results;
  }
}
