import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../service/ProductService';
import {
  CreateProductDTO,
  DisAproveOrApproveProductDTO,
  GetProductPaginationDTO,
  UpdateProductDTO,
} from '../DTO/ProductDTO';
import {
  ApiHeader,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResult } from 'src/common/interface/ApiResponse';
import { TokenDataDecorator } from 'src/common/decorator/tokenData.decoration';
import { TokenDto } from 'src/token/DTO/TokenDTO';
import { Product } from '../model/ProductModel';
import { AuthGuard } from 'src/common/guard/AuthGuard';
import {
  JoiObjectValidationPipe,
  ValidateObjectId,
} from 'src/common/pipe/validation.pipe';
import {
  ProductExistAdminGuard,
  ProductExistGuard,
} from '../guard/ProductGuard';
import { AdminGuard } from 'src/common/guard/AdminGuard';
import {
  createProductValidator,
  disapproveOrApproveProductValidator,
  getProductPaginationValidator,
  updateProductValidator,
} from '../validator/ProductValidator';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'product creation was successfull',
    schema: {
      example: {
        data: {
          name: 'Iphone 14',
          price: 1000000,
          quantity: 5,
          description: 'top best selling phone',
          currency: 'NGN',
          status: 'Pending',
          createdBy: '66d35a22c3117e4d001b9c5b',
          createdAt: '2024-08-31T19:35:06.162Z',
          id: '66d3706a402bbcbbe6ff6b0b',
        },
        message:
          'Product created successfully. You will be notified immediately your product gets approved',
      },
    },
  })
  @UseGuards(AuthGuard)
  async createProduct(
    @Body(new JoiObjectValidationPipe(createProductValidator))
    data: CreateProductDTO,
    @TokenDataDecorator() tokenData: TokenDto,
  ): Promise<ApiResult<Product>> {
    const product = await this.productService.createProduct(data, tokenData);
    return {
      data: product,
      message:
        'Product created successfully. You will be notified immediately your product gets approved',
    };
  }

  @Patch('update/:id')
  @ApiResponse({
    status: 200,
    description: 'product update was successfull',
    schema: {
      example: {
        data: {
          status: 'Pending',
          _id: '66d3de7c65c4a419eb7ecb81',
          price: 1000000,
          quantity: 5,
          name: 'Mac Book pro',
          description: 'top best selling laptop',
          currency: 'NGN',
          id: '66d3de7c65c4a419eb7ecb81',
        },
        message: 'Product updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'product was not found or does not exist',
    schema: {
      example: {
        message: 'product not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiParam({ name: 'id', description: 'Product ID', required: true })
  @UseGuards(AuthGuard, ProductExistGuard)
  async updateProduct(
    @Param('id', new ValidateObjectId()) id: string,
    @Body(new JoiObjectValidationPipe(updateProductValidator))
    data: UpdateProductDTO,
    @TokenDataDecorator() tokenData: TokenDto,
  ): Promise<ApiResult<Product>> {
    const updatedProduct = await this.productService.updateProduct(
      data,
      tokenData,
      id,
    );
    return {
      data: updatedProduct,
      message: 'Product updated successfully',
    };
  }

  @Delete('delete/:id')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Product deletion was successfull',
    schema: {
      example: {
        data: {
          _id: '66d35b4ed42fa75326a359b4',
          name: 'Iphone 14',
          price: 1000000,
          quantity: 5,
          description: 'top best selling phone',
          currency: 'NGN',
          status: 'Pending',
          createdAt: '2024-08-31T18:05:02.194Z',
          id: '66d35b4ed42fa75326a359b4',
        },
        message: 'Product deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'product was not found or does not exist',
    schema: {
      example: {
        message: 'product not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Product ID', required: true })
  @UseGuards(AuthGuard, ProductExistGuard)
  async deleteProduct(
    @Param('id', new ValidateObjectId()) id: string,
    @TokenDataDecorator() tokenData: TokenDto,
  ): Promise<ApiResult<Product>> {
    const deletedProduct = await this.productService.deleteProduct(
      id,
      tokenData,
    );
    return {
      data: deletedProduct,
      message: 'Product deleted successfully',
    };
  }

  @Patch(':id/disapprove-or-approve')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer token for authentication',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Product disapproval was successfull',
    schema: {
      example: {
        data: {
          _id: '66d3de7c65c4a419eb7ecb81',
          name: 'Ipad',
          price: 1000000,
          quantity: 5,
          description: 'top best selling phone',
          currency: 'NGN',
          status: 'Disapproved',
          createdBy: '66d3c861ec3e62a8b9803e2c',
          createdAt: '2024-09-01T03:24:44.417Z',
          id: '66d3de7c65c4a419eb7ecb81',
        },
        message: 'Product disapproved successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'product was not found or does not exist',
    schema: {
      example: {
        message: 'product not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  @ApiParam({ name: 'id', description: 'Product ID', required: true })
  @UseGuards(AdminGuard, ProductExistAdminGuard)
  async disapproveOrApproveProduct(
    @Param('id', new ValidateObjectId()) id: string,
    @Body(new JoiObjectValidationPipe(disapproveOrApproveProductValidator))
    data: DisAproveOrApproveProductDTO,
  ): Promise<ApiResult<Product>> {
    const disapprovedProduct =
      await this.productService.disApproveOrApproveProduct(id, data);
    return {
      data: disapprovedProduct,
      message: `Product ${data.status} successfully`,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfull',
    schema: {
      example: {
        data: {
          count: 2,
          totalPages: 1,
          currentPage: 1,
          product: [
            {
              _id: '66d3706a402bbcbbe6ff6b0b',
              name: 'Iphone 14',
              price: 1000000,
              quantity: 5,
              description: 'top best selling phone',
              currency: 'NGN',
              status: 'Approved',
              createdBy: {
                _id: '66d3c861ec3e62a8b9803e2c',
                name: 'Israel',
                email: 'amuneisrael223@gmail.com',
                accountStatus: 'Active',
                role: 'User',
              },
              createdAt: '2024-08-31T19:35:06.162Z',
              id: '66d3706a402bbcbbe6ff6b0b',
            },
            {
              _id: '66d3de7c65c4a419eb7ecb81',
              name: 'Ipad',
              price: 1000000,
              quantity: 5,
              description: 'top best selling phone',
              currency: 'NGN',
              status: 'Approved',
              createdBy: {
                _id: '66d3c861ec3e62a8b9803e2c',
                name: 'Israel',
                email: 'amuneisrael223@gmail.com',
                accountStatus: 'Active',
                role: 'User',
              },
              createdAt: '2024-09-01T03:24:44.417Z',
              id: '66d3de7c65c4a419eb7ecb81',
            },
          ],
        },
        message: 'Product retrieved successfully',
      },
    },
  })
  @ApiQuery({
    name: 'limit',
    description: 'number of product to be fetched per page',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'next page info to fetch new set of products',
    required: false,
  })
  @Get('view-all')
  async getProducts(
    @Query(new JoiObjectValidationPipe(getProductPaginationValidator))
    dto: GetProductPaginationDTO,
  ): Promise<ApiResult> {
    const products = await this.productService.getProduct(dto);
    return {
      data: products,
      message: 'Products retrieved successfully',
    };
  }
}
