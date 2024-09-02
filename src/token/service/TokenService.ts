import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDTO, TokenDto } from '../DTO/TokenDTO';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from 'src/common/enum/envConfig.enum';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  private tokenExpiresIn: string;
  private tokenSecret: string;
  private refreshTokenSecret: string;
  private refreshTokenExpiresIn: string;

  constructor(private readonly config: ConfigService) {
    this.tokenExpiresIn = this.config.get(EnvConfigEnum.TOKEN_EXPIRATION_TIME);
    this.tokenSecret = this.config.get(EnvConfigEnum.TOKEN_SECRET);
    this.refreshTokenSecret = this.config.get(
      EnvConfigEnum.REFRESH_TOKEN_SECRET,
    );
    this.refreshTokenExpiresIn = config.get(
      EnvConfigEnum.REFRESH_TOKEN_EXPIRATION_TIME,
    );
  }

  async generateAuthorizationToken(data: TokenDto) {
    const token = jwt.sign(data, this.tokenSecret, {
      expiresIn: this.tokenExpiresIn,
    });
    return token;
  }

  async generateRefreshToken(data: RefreshTokenDTO) {
    const refreshToken = jwt.sign(data, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiresIn,
    });
    return refreshToken;
  }

  verifyAuthroizationToken(token: string): TokenDto {
    try {
      const decodedToken = jwt.verify(
        token,
        this.tokenSecret,
      ) as unknown as TokenDto;
      return decodedToken;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }

  verifyRefreshToken(token: string): RefreshTokenDTO {
    try {
      const decodedToken = jwt.verify(
        token,
        this.refreshTokenSecret,
      ) as unknown as RefreshTokenDTO;
      return decodedToken;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
