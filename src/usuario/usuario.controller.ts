import { Controller, Post, Body, Get, Param, Put, Patch, Delete, ParseIntPipe} from "@nestjs/common";
import { CreateUsuarioDTO } from "./dto/create-usuario.dto";
import { UpdatePutUsuarioDTO } from "./dto/update-put-usuario.dto";
import { UpdatePatchUsuarioDTO } from "./dto/update-patch-usuario.dto";
import { UsuarioService } from "./usuario.service";

@Controller('usuarios')
export class UsuarioController{
    constructor(private readonly usuarioService: UsuarioService){}

    @Post()
    async criar(@Body() createUsuarioDto: CreateUsuarioDTO){
        return this.usuarioService.create(createUsuarioDto);
    }

    @Get()
    async listarTodos() {
        return this.usuarioService.findAll();
    }

    @Get(':id')
    async listarUm(@Param('id', ParseIntPipe) id: number){
        return this.usuarioService.findOne(id);
    }

    @Put(':id')
    async update(@Body() updatePutUsuarioDto: UpdatePutUsuarioDTO, @Param('id', ParseIntPipe) id: number) {
        return this.usuarioService.update(id, updatePutUsuarioDto)
    }

    @Patch(':id')
    async updateParcial(@Body() updatePatchUsuarioDto: UpdatePatchUsuarioDTO, @Param('id', ParseIntPipe) id: number) {
        return this.usuarioService.updateParcial(id, updatePatchUsuarioDto)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.usuarioService.remove(id);
    }
}