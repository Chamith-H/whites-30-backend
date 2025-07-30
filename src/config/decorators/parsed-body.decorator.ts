import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParsedBody = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const dto = request.body;

    if (dto && dto.values) {
      return JSON.parse(dto.values);
    }

    return null;
  },
);
