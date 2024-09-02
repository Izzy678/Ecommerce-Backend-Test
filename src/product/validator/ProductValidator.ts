import * as Joi from 'joi';
import { CurrencyEnum } from 'src/common/enum/CurrencyEnum';
import { ProductStatusEnum } from 'src/common/enum/ProductStatusEnum';

// CreateProductDTO Validator
export const createProductValidator = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  quantity: Joi.number().required(),
  description: Joi.string().required(),
  currency: Joi.string()
    .valid(...Object.values(CurrencyEnum))
    .required()
    .example('USD'),
});

// UpdateProductDTO Validator
export const updateProductValidator = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().optional(),
  quantity: Joi.number().optional(),
  description: Joi.string().optional(),
  currency: Joi.string()
    .valid(...Object.values(CurrencyEnum))
    .optional()
    .example('USD'),
});

// GetProductDTO Validator
export const getProductPaginationValidator = Joi.object({
  limit: Joi.number().optional().default(100),
  page: Joi.number().optional().default(1),
});

export const disapproveOrApproveProductValidator = Joi.object({
  status: Joi.string()
    .valid(...Object.values(ProductStatusEnum))
    .required(),
});
