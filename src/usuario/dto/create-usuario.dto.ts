import { IsString, IsEmail, IsStrongPassword } from "class-validator";


export class CreateUsuarioDTO {
    
    @IsString()
    nome: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 4,
        minNumbers: 0,
        minSymbols: 0,
        minUppercase: 0,
        minLowercase: 0
    })
    senha: string;
}