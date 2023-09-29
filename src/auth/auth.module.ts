import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UsuarioModule } from "src/usuario/usuario.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        JwtModule.register({
            secret: String(process.env.JWT_SECRET)
        }),
        forwardRef(() => UsuarioModule),
        TypeOrmModule.forFeature([Usuario])
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {

}