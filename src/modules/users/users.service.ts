import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { HashService } from '@common/hash/hash.service';
import { paginate } from '@common/utils/pagination/paginate.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AssignRoleUserInput } from './dto/assign-role-user.input';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Permission } from './roles/permissions/schemas/permission.schema';
import { Role } from './roles/schemas/role.schema';
import { User } from './schemas/user.schema';
import { LoggerService } from '@common/logger/logger.service';
import { RolesService } from './roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly hashService: HashService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Permission.name)
    private readonly rolesService: RolesService,
    private readonly loggerService: LoggerService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const { password } = createUserInput;

    const hashedPassword = await this.hashService.hash(password);

    const newUser = new this.userModel({
      ...createUserInput,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(paginationOptions: PaginationOptionsDto) {
    return await paginate(
      this.userModel,
      {
        page: paginationOptions.page,
        take: paginationOptions.take,
      },
      {},
    );
  }

  async findOne(id: string) {
    const userFound = await this.userModel.findById(id).exec();

    if (!userFound) throw new NotFoundException(`User with ID ${id} not found`);

    return userFound;
  }

  async findOneByEmail(email: string) {
    const userFound = await this.userModel.findOne({ email });

    return userFound;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const userFound = await this.userModel.findByIdAndUpdate(
      id,
      updateUserInput,
      {
        new: true,
      },
    );

    if (!userFound) throw new NotFoundException(`User with ID ${id} not found`);

    return userFound;
  }

  async assignRoleToUser(assignRoleUserInput: AssignRoleUserInput) {
    const { roleId, userId } = assignRoleUserInput;

    const userFound = await this.userModel.findById(userId);

    if (!userFound)
      throw new NotFoundException(
        `User with ID ${userId.toString()} not found`,
      );

    const roleFound = await this.rolesService.findOne(roleId);

    if (!roleFound)
      throw new NotFoundException(
        `Role with ID ${roleId.toString()} not found`,
      );

    if (!Array.isArray(userFound.roles)) {
      userFound.roles = [];
    }

    userFound.roles.push({
      _id: roleFound._id,
    } as Role);

    await userFound.save();

    return userFound;
  }

  async getUserRoles(userId: string) {
    const userFound = await this.userModel
      .findById(userId)
      .populate({
        path: 'roles',
      })
      .exec();

    if (!userFound)
      throw new NotFoundException(`User with ID ${userId} not found`);

    return userFound.roles;
  }

  async remove(id: string) {
    const userFound = await this.userModel.findByIdAndDelete(id);

    if (!userFound) throw new NotFoundException(`User with ID ${id} not found`);

    return userFound;
  }
}
