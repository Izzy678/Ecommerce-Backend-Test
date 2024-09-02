import * as Joi from 'joi';
import { AccountStatusEnum } from 'src/common/enum/AccountStatusEnum';

export const signInValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const signUpValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
});

export const modifyUserStatusValidator = Joi.object({
  status: Joi.string()
    .valid(...Object.values(AccountStatusEnum))
    .required(),
});
