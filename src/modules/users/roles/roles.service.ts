import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schemas/role.schema';
import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { paginate } from '@common/utils/pagination/paginate.util';
import { CreateRoleInput } from './dto/create-role.input';
import { PermissionsService } from './permissions/permissions.service';
import {
  Permission,
  PermissionDocument,
} from './permissions/schemas/permission.schema';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    private readonly permissionService: PermissionsService,
  ) {}

  async create(role: CreateRoleInput): Promise<Role> {
    const { name, description, permissions } = role;

    let createdPermissions: PermissionDocument[] | undefined;

    if (permissions) {
      createdPermissions = await this.permissionService.createMany(permissions);
    }

    const createdRole = new this.roleModel({
      name,
      description,
      permissions: createdPermissions?.map((permission) => permission._id),
    });

    return await createdRole.save();
  }

  async findAll(paginationOptions: PaginationOptionsDto) {
    return await paginate(
      this.roleModel,
      paginationOptions,
      {},
      {
        path: 'permissions',
        model: Permission.name,
      },
    );
  }

  async findOne(id: string): Promise<Role | null> {
    return await this.roleModel.findById(id).populate('permissions').exec();
  }

  async update(id: string, role: Partial<Role>): Promise<Role | null> {
    return await this.roleModel
      .findByIdAndUpdate(id, role, {
        new: true,
        runValidators: true,
      })
      .populate('permissions')
      .exec();
  }
}
