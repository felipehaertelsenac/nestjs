import { Body, Controller, Post, UseGuards, Req } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UsuarioService } from "src/usuario/usuario.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";
import { Usuario } from "src/decorators/usuario.decorator";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly authService: AuthService
    ){}

    @Post('login')
    async login(@Body() {email, senha}: AuthLoginDTO){
        return this.authService.login(email, senha)
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO){
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() {email}: AuthForgetDTO){
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() {senha, token}: AuthResetDTO){
        return this.authService.reset(senha, token)
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@Usuario() user){
        return {user}
    }
}