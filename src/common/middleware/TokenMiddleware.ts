import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccountStatusEnum } from '../enum/AccountStatusEnum';
import { TokenService } from 'src/token/service/TokenService';
import { TokenDto } from 'src/token/DTO/TokenDTO';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) return next();
    const authorizationHeader = req.headers.authorization;
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer') {
      throw new UnauthorizedException('please provide a Bearer token');
    }

    if (!token) {
      throw new UnauthorizedException('token not found');
    }
    const tokenData: TokenDto =
      this.tokenService.verifyAuthroizationToken(token);

    if (tokenData.accountStatus === AccountStatusEnum.Suspended) {
      throw new BadRequestException(
        'your account is suspended, kindly reach out to your administrator for instructions on reactivating your account',
      );
    }
    res.locals.tokenData = tokenData;
    next();
  }
}
