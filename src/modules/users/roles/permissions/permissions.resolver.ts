import { Resolver } from '@nestjs/graphql';
import { PermissionsService } from './permissions.service';

@Resolver()
export class PermissionsResolver {
  constructor(private readonly permissionsService: PermissionsService) {}
}
