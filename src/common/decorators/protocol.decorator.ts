import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Protocol = createParamDecorator(
  (defaultValue: unknown, ctx: ExecutionContext) => {
    console.log('default :', defaultValue);
    const request = ctx.switchToHttp().getRequest();
    return request.protocol;
  },
);
