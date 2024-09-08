import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { User } from './user.entity';

export const getUser = createParamDecorator(
  (_, ctx: ExecutionContextHost): User => {
    const req = ctx.switchToHttp().getRequest();

    return req.user;
  },
);
