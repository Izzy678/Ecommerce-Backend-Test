import { Global, Module } from "@nestjs/common";
import { TokenService } from "./service/TokenService";
@Global()
@Module({
    controllers: [],
    providers: [TokenService],
     exports: [TokenService]
})
export class TokenModule { }