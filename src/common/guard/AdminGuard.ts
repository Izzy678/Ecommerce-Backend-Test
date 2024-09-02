import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenDto } from 'src/token/DTO/TokenDTO';
import { RoleEnum } from '../enum/RoleEnums';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader)
      throw new UnauthorizedException(
        'Authorization header is missing. Please provide a valid token.',
      );
    const res = context.switchToHttp().getResponse();
    const tokenData = res.locals.tokenData as TokenDto;
    if (!tokenData)
      throw new UnauthorizedException('Please provide a valid token.');
    //check tokenData role.
    if (tokenData.role != RoleEnum.Admin)
      throw new UnauthorizedException(
        'You dont have the neccessary permission to access this resource',
      );
    return true;
  }
}
