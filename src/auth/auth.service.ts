import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/usuario/entities/usuario.entity";
import { UsuarioService } from "src/usuario/usuario.service";
import { Repository } from "typeorm";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService{

    private issuer = 'login';
    private audience = 'usuarios';

    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private readonly usuarioService: UsuarioService
    ) {}

    createToken(user:Usuario){
        return {
            accessToken: this.jwtService.sign({
                id: user.id,
                nome: user.nome,
                email: user.email
            }, {
                expiresIn: "3 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    checkToken(token: string){
        try {
            const data = this.jwtService.verify(token, {
                issuer: this.issuer,
                audience: this.audience
            });
            return data;
        } catch (e) {
            throw new BadRequestException(e);
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (e) {
            return false;
        }
    }

    async login(email: string, senha:string) {
        const user = await this.usuarioRepository.findOne({
            where: {
               email 
            }
        })

        if (!user) {
            throw new UnauthorizedException('E-mail ou senha incorretos.');
        }

        if (!await bcrypt.compare(senha, user.senha)) {
            throw new UnauthorizedException('E-mail ou senha incorretos');
        }

        return this.createToken(user);
    }
    
    async forget(email: string) {
        const user = await this.usuarioRepository.findOne({
            where: {
               email 
            }
        })

        if (!user) {
            throw new UnauthorizedException('E-mail incorretos.');
        }

        // enviar e-mail

        return true;
    }

    async reset(senha: string, token: string) {
        // validar o token
        try {
            const data: any = this.jwtService.verify(token, {
                issuer: 'forget',
                audience: this.audience
            })

            if (isNaN(Number(data.id))) {
                throw new BadRequestException("Token inválido!");
            }

            const salt = await bcrypt.genSalt();
            senha = await bcrypt.hash(senha, salt)

            await this.usuarioRepository.update(Number(data.id), {
                senha
            });

            const user = await this.usuarioService.findOne(Number(data.id));
    
            return this.createToken(user);

        } catch (e) {
            throw new BadRequestException(e);
        }

        

        
    }

    async register(data: AuthRegisterDTO) {
        const user = await this.usuarioService.create(data);

        return this.createToken(user);
    }
}