import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { HashService } from '@common/hash/hash.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { PaginatedUsersOutput } from './dto/paginated-users.output';
import { paginate } from '@common/utils/pagination/paginate.util';
import { Role } from './roles/schemas/role.schema';
import { Permission } from './roles/permissions/schemas/permission.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly hashService: HashService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>,
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
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

  async findAll(
    paginationOptions: PaginationOptionsDto,
  ): Promise<PaginatedUsersOutput> {
    return await paginate(this.userModel, paginationOptions);
  }

  async findOne(id: string) {
    console.log('Finding user with ID:', id);
    const userFound = await this.userModel
      .findById(id)
      .populate('roles', null, this.roleModel)
      .populate('roles.permissions', 'actions resource', this.permissionModel)
      .exec();

    console.log('User found:', userFound);
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

  async remove(id: string) {
    const userFound = await this.userModel.findByIdAndDelete(id);

    if (!userFound) throw new NotFoundException(`User with ID ${id} not found`);

    return userFound;
  }
}
