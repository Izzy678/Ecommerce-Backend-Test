import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from '../service/ProductService';
import { TokenDto } from 'src/token/DTO/TokenDTO';

@Injectable()
export class ProductExistGuard implements CanActivate {
  constructor(private readonly productService: ProductService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const productId = req.params.id;
    const res = context.switchToHttp().getResponse();
    const tokenData = res.locals.tokenData as TokenDto;
    const product = await this.productService.findOne({
      _id: productId,
      createdBy: tokenData.userId,
    });
    if (!product) throw new NotFoundException('product not found');
    return true;
  }
}

@Injectable()
export class ProductExistAdminGuard implements CanActivate {
  constructor(private readonly productService: ProductService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const productId = req.params.id;
    const product = await this.productService.findById(productId);
    if (!product) throw new NotFoundException('product not found');
    return true;
  }
}
