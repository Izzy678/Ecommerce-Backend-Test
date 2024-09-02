import { ApiProperty } from '@nestjs/swagger';
import { AccountStatusEnum } from 'src/common/enum/AccountStatusEnum';

export class UserSignUpDTO {
  @ApiProperty({
    example: 'Israel',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'amuneIsrael224@gmail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'password$$2020',
    required: true,
  })
  password: string;
}

export class UserSignInDTO {
  @ApiProperty({
    example: 'amuneIsrael224@gmail.com',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'password$$2020',
    required: true,
  })
  password: string;
}

export class ModifyUserStatusDTO {
  @ApiProperty({
    enum: Object.values(AccountStatusEnum),
    required: true,
  })
  status: AccountStatusEnum;
}
