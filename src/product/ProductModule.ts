import { Module } from "@nestjs/common";
import { ProductController } from "./controller/ProductController";
import { ProductService } from "./service/ProductService";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductModel } from "./model/ProductModel";

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    imports: [
        MongooseModule.forFeatureAsync([
            {
              name: Product.name,
              useFactory: () => {
                return ProductModel;
              },
            },
          ]),
    ]
})
export class ProductModule {

}