import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from "@nestjs/common";
import { UsuarioController } from "./usuario.controller";
import { UsuarioService } from "./usuario.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Usuario } from "./entities/usuario.entity";
import { AuthModule } from "src/auth/auth.module";
import { UsuarioIdCheckMiddleware } from "src/middlewares/usuario-id-check.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([Usuario]), forwardRef(() =>  AuthModule)],
    controllers: [UsuarioController],
    providers:[UsuarioService],
    exports:[UsuarioService]
})
export class UsuarioModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UsuarioIdCheckMiddleware).forRoutes({
            path: 'usuarios/:id',
            method: RequestMethod.ALL
        })
    }
}