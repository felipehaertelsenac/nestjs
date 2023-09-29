import { Controller, Post, Body, Get, Param, Put, Patch, Delete, ParseIntPipe, UseGuards, UseInterceptors} from "@nestjs/common";
import { CreateUsuarioDTO } from "./dto/create-usuario.dto";
import { UpdatePutUsuarioDTO } from "./dto/update-put-usuario.dto";
import { UpdatePatchUsuarioDTO } from "./dto/update-patch-usuario.dto";
import { UsuarioService } from "./usuario.service";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/decorators/param-id.decorator";

@Roles(Role.Admin)
@UseGuards(AuthGuard, RoleGuard)
@Controller('usuarios')
export class UsuarioController{
    constructor(private readonly usuarioService: UsuarioService){}

    @UseInterceptors(LogInterceptor)
    @Post()
    async criar(@Body() createUsuarioDto: CreateUsuarioDTO){
        return this.usuarioService.create(createUsuarioDto);
    }

    @Get()
    async listarTodos() {
        return this.usuarioService.findAll();
    }

    @Get(':id')
    async listarUm(@ParamId() id: number){
        return this.usuarioService.findOne(id);
    }

    @Put(':id')
    async update(@Body() updatePutUsuarioDto: UpdatePutUsuarioDTO, @ParamId() id: number) {
        return this.usuarioService.update(id, updatePutUsuarioDto)
    }

    @Patch(':id')
    async updateParcial(@Body() updatePatchUsuarioDto: UpdatePatchUsuarioDTO, @ParamId() id: number) {
        return this.usuarioService.updateParcial(id, updatePatchUsuarioDto)
    }

    @Delete(':id')
    async delete(@ParamId() id: number) {
        return this.usuarioService.remove(id);
    }
}