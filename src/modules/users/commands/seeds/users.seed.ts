import { RegisterInput } from '@auth/dto/register.input';
import { RolesService } from '@users/roles/roles.service';
import { UsersService } from '@users/users.service';
import { plainToInstance } from 'class-transformer';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'user:admin:seed',
  description: 'Seed the database with default roles',
})
export class UserSeed extends CommandRunner {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {
    super();
  }

  async run() {
    const newUserAdmin = plainToInstance(RegisterInput, {
      email: 'admin@admin.com',
      password: 'StrongPassword123!',
      username: 'ADMIN',
    });

    const userRegistered = await this.usersService.create(newUserAdmin);

    if (!userRegistered) {
      console.error('Failed to create admin user');
      return;
    }

    const roleAdmin = await this.rolesService.findAll({
      page: 1,
      take: 10,
      name: 'ADMIN',
    });

    console.log(roleAdmin);

    if (!roleAdmin || roleAdmin.items.length === 0) {
      console.error('No admin role found');
      return;
    }

    await this.usersService.assignRoleToUser({
      userId: userRegistered._id,
      roleId: roleAdmin.items[0]._id,
    });

    console.log('Admin user seeded successfully');
  }
}
