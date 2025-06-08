import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { HashService } from '@common/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly hashService: HashService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
}
