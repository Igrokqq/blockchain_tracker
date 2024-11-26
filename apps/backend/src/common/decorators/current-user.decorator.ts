import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserTokenObject } from '../interfaces';


export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    return user as UserTokenObject;
  },
);
