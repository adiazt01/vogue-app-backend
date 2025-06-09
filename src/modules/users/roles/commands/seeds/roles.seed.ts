import { RolesService } from '@users/roles/roles.service';
import { Command, CommandRunner } from 'nest-commander';

@Command({
  name: 'roles:seed',
  description: 'Seed the database with default roles',
})
export class RoleSeed extends CommandRunner {
  constructor(private readonly roleService: RolesService) {
    super();
  }

  async run() {}
}
