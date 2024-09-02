import { BaseService } from 'src/common/db/BaseService';
import { ProdDoc, Product } from '../model/ProductModel';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateProductDTO,
  DisAproveOrApproveProductDTO,
  GetProductPaginationDTO,
  UpdateProductDTO,
} from '../DTO/ProductDTO';
import { TokenDto } from 'src/token/DTO/TokenDTO';
import { ProductStatusEnum } from 'src/common/enum/ProductStatusEnum';
import { stat } from 'fs';

export class ProductService extends BaseService<ProdDoc, ''> {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProdDoc>,
  ) {
    super(productModel);
  }

  async createProduct(
    data: CreateProductDTO,
    tokenData: TokenDto,
  ): Promise<Product> {
    return await this.createDocuments({
      ...data,
      createdBy: tokenData.userId,
    });
  }

  async updateProduct(
    data: UpdateProductDTO,
    tokenData: TokenDto,
    productId: string,
  ): Promise<Product> {
    return await this.findOneAndUpdateOrErrorOut(
      { _id: productId, createdBy: tokenData.userId },
      {
        ...data,
        updatedAt: new Date(),
      },
      ['createdBy'],
    );
  }

  async deleteProduct(
    productId: string,
    tokenData: TokenDto,
  ): Promise<Product> {
    return await this.findOneAndDelete({
      _id: productId,
      createdBy: tokenData.userId,
    });
  }

  async disApproveOrApproveProduct(
    productId: string,
    data: DisAproveOrApproveProductDTO,
  ): Promise<Product> {
    return await this.findByIdAndUpdate(productId, {
      status: data.status,
    });
  }

  async getProduct(filter: GetProductPaginationDTO): Promise<{
    count: number;
    totalPages: number;
    currentPage: number;
    product: Product[];
  }> {
    const { limit, page } = filter;
    const count = await this.countDocuments({
      status: ProductStatusEnum.Approved,
    });
    const totalPages = Math.ceil(count / limit);
    const currentPage = page;
    const product = await this.find({
      status: ProductStatusEnum.Approved,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('createdBy');
    return { count, totalPages, currentPage, product };
  }
}
