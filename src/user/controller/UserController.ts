import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/UserService';
import {
  ModifyUserStatusDTO,
  UserSignInDTO,
  UserSignUpDTO,
} from '../DTO/UserDTO';
import {
  JoiObjectValidationPipe,
  ValidateObjectId,
} from 'src/common/pipe/validation.pipe';
import {
  modifyUserStatusValidator,
  signInValidator,
  signUpValidator,
} from '../validator/UserValidator';
import {
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResult } from 'src/common/interface/ApiResponse';
import { User, UserDoc } from '../model/UserModel';
import { TokenService } from 'src/token/service/TokenService';
import { AdminGuard } from 'src/common/guard/AdminGuard';
import { AccountStatusEnum } from 'src/common/enum/AccountStatusEnum';
import { stat } from 'fs';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('sign-up')
  @ApiResponse({
    status: 200,
    description: 'user signed up successfully',
    schema: {
      example: {
        data: {
          name: 'Israel',
          email: 'amuneisrael223@gmail.com',
          accountStatus: 'Active',
          role: 'User',
          createdAt: '2024-08-31T18:00:02.026Z',
        },
        message: 'signed up successfully',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User with the provided email already exists.',
    schema: {
      example: {
        message: 'User with the provided email already exists',
        error: 'Conflict',
        statusCode: 409,
      },
    },
  })
  @ApiBody({
    type: UserSignUpDTO,
    description: 'Json structure for user object',
  })
  async signUp(
    @Body(new JoiObjectValidationPipe(signUpValidator)) dto: UserSignUpDTO,
  ): Promise<ApiResult<User>> {
    const data = await this.userService.signUp(dto);
    return {
      data,
      message: 'signed up successfully',
    };
  }

  @Post('sign-in')
  @ApiResponse({
    status: 200,
    description: 'signed in successfully',
    schema: {
      example: {
        data: {
          user: {
            name: 'Israel',
            email: 'amuneisrael223@gmail.com',
            accountStatus: 'Active',
            role: 'User',
            createdAt: '2024-08-31T18:00:02.026Z',
            id: '66d35a22c3117e4d001b9c5b',
          },
          authorizationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        },
        message: 'signed in successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'invalid email or password',
    schema: {
      example: {
        message: 'invalid email or password',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'suspended account',
    schema: {
      example: {
        message:
          'Your account has been suspended contact your adminfor more info.',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  async signIn(
    @Body(new JoiObjectValidationPipe(signInValidator)) dto: UserSignInDTO,
  ): Promise<ApiResult> {
    const user = await this.userService.signIn(dto);
    //handle token
    const authorizationToken =
      await this.tokenService.generateAuthorizationToken({
        userId: user._id,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
      });

    const refreshToken = await this.tokenService.generateRefreshToken({
      userId: user.id,
    });

    //update user refresh token
    await this.userService.findOneAndUpdateOrErrorOut(
      { email: user.email },
      { refreshToken: refreshToken },
    );

    return {
      data: {
        user,
        authorizationToken,
        refreshToken,
      },
      message: 'signed in successfully',
    };
  }

  @Patch(':id/status')
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiResponse({
    example: {
      data: {
        _id: '66d3c861ec3e62a8b9803e2c',
        name: 'Israel',
        email: 'amuneisrael223@gmail.com',
        accountStatus: 'Suspended',
        role: 'User',
      },
      message: 'user status updated successfully',
    },
  })
  @UseGuards(AdminGuard)
  async modifyUserStatus(
    @Param('id') userId: string,
    @Body(new JoiObjectValidationPipe(modifyUserStatusValidator))
    data: ModifyUserStatusDTO,
  ): Promise<ApiResult<User>> {
    const updatedUser = await this.userService.modifyUserAccountStatus(
      userId,
      data,
    );
    return {
      message: `user status updated successfully`,
      data: updatedUser,
    };
  }
}
