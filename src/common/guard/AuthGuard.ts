import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader)
      throw new UnauthorizedException(
        'Authorization header is missing. Please provide a valid token.',
      );
    return true;
  }
}
