import { AbilityFactory } from '@auth/factories/ability.factory';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private readonly abilityFactory: AbilityFactory,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const action = this.reflector.get<string>('action', context.getHandler());
    const resource = this.reflector.get<string>(
      'resource',
      context.getHandler(),
    );

    if (!action || !resource) {
      throw new ForbiddenException(
        'Action or resource metadata not found for permission validation',
      );
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext.req.user;

    const ability = await this.abilityFactory.defineAbilityForUser(user.sub);

    if (!ability.can(action, resource)) {
      throw new ForbiddenException(
        `User does not have permission to perform "${action}" on "${resource}"`,
      );
    }

    return true;
  }
}
