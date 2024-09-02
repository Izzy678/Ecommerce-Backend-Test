import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserModel } from "./model/UserModel";
import { UserController } from "./controller/UserController";
import { UserService } from "./service/UserService";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [
        MongooseModule.forFeatureAsync([
            {
              name: User.name,
              useFactory: () => {
                return UserModel;
              },
            },
          ]),
    ]
})
export class UserModule {

}