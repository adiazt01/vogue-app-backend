import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginatedUsersOutput } from './dto/paginated-users.output';
import { PaginationOptionsDto } from '@common/dtos/pagination/pagination-options.dto';
import { Role } from './roles/entities/role.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User, {
    name: 'CreateUserInput',
    description: 'Create a new user',
  })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => PaginatedUsersOutput, { name: 'users' })
  findAll(@Args() paginationOptions: PaginationOptionsDto) {
    return this.usersService.findAll(paginationOptions);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  @ResolveField(() => [Role], {
    name: 'roles',
    description: 'Get roles of the user',
  })
  async getRoles(@Parent() user: User) {
    return this.usersService.getUserRoles(user._id);
  }
}
