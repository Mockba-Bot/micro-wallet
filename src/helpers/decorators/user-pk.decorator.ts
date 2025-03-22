import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserPk = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  const privateKey = request.privateKey;

  return { user, privateKey };
});
