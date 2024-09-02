import { BaseService } from 'src/common/db/BaseService';
import { User, UserDoc } from '../model/UserModel';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ModifyUserStatusDTO,
  UserSignInDTO,
  UserSignUpDTO,
} from '../DTO/UserDTO';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyPassword } from 'src/common/function/verifyPassword';
import { hashPassword } from 'src/common/function/hashPassword';
import { AccountStatusEnum } from 'src/common/enum/AccountStatusEnum';

@Injectable()
export class UserService extends BaseService<UserDoc, ''> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDoc>,
  ) {
    super(userModel);
  }

  async signUp(dto: UserSignUpDTO) {
    //check if email exist
    const emailExist = await this.findOne({ email: dto.email });
    if (emailExist)
      throw new ConflictException(
        'User with the provided email already exists',
      );
    //hash password
    const hashedPassword = await hashPassword(dto.password);
    return await this.createDocuments({ ...dto, password: hashedPassword });
  }

  async signIn(dto: UserSignInDTO): Promise<UserDoc> {
    //check if user exist
    const userExist = await this.findOne({ email: dto.email });
    if (!userExist)
      throw new UnauthorizedException('invalid email or password');
    //validate password
    const isValid = await verifyPassword(dto.password, userExist.password);
    if (!isValid) throw new UnauthorizedException('invalid email or password');
    if (userExist.accountStatus == AccountStatusEnum.Suspended)
      throw new UnauthorizedException(
        'Your account has been suspended contact your adminfor more info.',
      );
    return userExist;
  }

  async modifyUserAccountStatus(
    userId: string,
    status: ModifyUserStatusDTO,
  ): Promise<User> {
    const user = await this.findByIdAndUpdate(userId, {
      accountStatus: status.status,
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
}
