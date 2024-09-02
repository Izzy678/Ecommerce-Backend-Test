import { AccountStatusEnum } from 'src/common/enum/AccountStatusEnum';
import { RoleEnum } from 'src/common/enum/RoleEnums';

export class TokenDto {
  userId: string;
  email: string;
  accountStatus: AccountStatusEnum;
  role: RoleEnum;
}

export class RefreshTokenDTO {
  userId: string;
}
