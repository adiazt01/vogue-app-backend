import { AbilityFactory } from '@auth/factories/ability.factory';
import { JwtPayload } from '@auth/interfaces/jwt-payload.interface';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { Types } from 'mongoose';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private readonly abilityFactory: AbilityFactory,
    private readonly reflector: Reflector,
  ) { }

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

    const gqlContext = GqlExecutionContext.create(context).getContext<{
      req: Request;
    }>();

    const user = gqlContext.req.user as JwtPayload;

    const ability = await this.abilityFactory.defineAbilityForUser(user.sub as Types.ObjectId);

    if (!ability.can(action, resource)) {
      throw new ForbiddenException(
        `User does not have permission to perform "${action}" on "${resource}"`,
      );
    }

    return true;
  }
}
