import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';
import { TokenDto } from 'src/token/DTO/TokenDTO';


export const TokenDataDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response: Response = ctx.switchToHttp().getResponse();
    return response.locals.tokenData as TokenDto;
  },
);
