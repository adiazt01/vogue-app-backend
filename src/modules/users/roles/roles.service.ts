import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from './schemas/role.schema';
import { paginate } from '@common/utils/pagination/paginate.util';
import { CreateRoleInput } from './dto/create-role.input';
import { PermissionsService } from './permissions/permissions.service';
import { PermissionDocument } from './permissions/schemas/permission.schema';
import { PaginationRolesOptionsArgs } from './dto/pagination-roles-options.args';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    private readonly permissionService: PermissionsService,
  ) {}

  async create(role: CreateRoleInput): Promise<Role> {
    const { name, description, permissions, isDefault } = role;

    if (isDefault) {
      const isDefaultRoleSetter = await this.findByDefault();

      if (isDefaultRoleSetter) {
        throw new BadRequestException('Only one default role can exist');
      }
    }

    let createdPermissions: PermissionDocument[] | undefined;

    if (permissions) {
      createdPermissions = await this.permissionService.createMany(permissions);
    }

    const createdRole = new this.roleModel({
      name,
      description,
      permissions: createdPermissions?.map((permission) => permission._id),
      isDefault,
    });

    return await createdRole.save();
  }

  async findAll(paginationRolesOptionsArgs: PaginationRolesOptionsArgs) {
    return await paginate(
      this.roleModel,
      paginationRolesOptionsArgs,
      {
        name: paginationRolesOptionsArgs.name,
      },
      [
        {
          path: 'permissions',
        },
      ],
    );
  }

  async findOne(id: Types.ObjectId | string) {
    const roleFound = await this.roleModel.findById(id).lean().exec();

    if (!roleFound)
      throw new NotFoundException(`Role with ID ${id.toString()} not found`);

    return roleFound;
  }

  async findByDefault() {
    return await this.roleModel.findOne({ isDefault: true }).exec();
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

  async getRolePermissions(roleId: string) {
    const role = await this.roleModel
      .findById(roleId)
      .populate('permissions')
      .exec();

    if (!role) {
      throw new BadRequestException(`Role with ID ${roleId} not found`);
    }

    return role.permissions;
  }
}
