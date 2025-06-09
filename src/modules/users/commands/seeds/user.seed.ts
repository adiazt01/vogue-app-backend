import { Command, CommandRunner } from 'nest-commander';
import { UsersService } from '@users/users.service';

@Command({
  name: 'user:seed',
  description: 'Seed the database with a default user',
})
export class UserSeed extends CommandRunner {
  constructor(private readonly userService: UsersService) {
    super();
  }

  async run() {
    const defaultUser = {
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
    };

    console.log('Seeding default user...');
  }
}
