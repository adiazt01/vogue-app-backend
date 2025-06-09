import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { HashService } from '@common/hash/hash.service';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { PaginatedUsersOutput } from './dto/paginated-users.output';
import { PaginationMetadataDto } from '@common/dtos/pagination/pagination-metadata.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly hashService: HashService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
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
    const { page = 1, take = 10 } = paginationOptions;
    const skip = (page - 1) * take;

    const [items, totalItems] = await Promise.all([
      this.userModel.find().skip(skip).limit(take).exec(),
      this.userModel.countDocuments().exec(),
    ]);

    const meta = new PaginationMetadataDto({
      paginationOptionsDto: paginationOptions,
      itemCount: totalItems,
    });

    return { items, meta };
  }

  findOne(id: number) {
    return this.userModel.findById(id).exec();
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
