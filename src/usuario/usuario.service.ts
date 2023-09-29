import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDTO } from './dto/create-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { UpdatePatchUsuarioDTO } from './dto/update-patch-usuario.dto';
import { UpdatePutUsuarioDTO } from './dto/update-put-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ){}

  async create(createUsuarioDTO: CreateUsuarioDTO) {
    
    if (await this.usuarioRepository.exist({
      where: {
        email: createUsuarioDTO.email
      }
    })) {
      throw new BadRequestException("E-mail já cadastrado");
    }

    const salt = await bcrypt.genSalt();

    createUsuarioDTO.senha = await bcrypt.hash(createUsuarioDTO.senha, salt);
    return this.usuarioRepository.save(createUsuarioDTO);
    
  }

  async update(id: number, updatePutUsuarioDto: UpdatePutUsuarioDTO) {
    await this.exists(id);
    
    const salt = await bcrypt.genSalt();

    updatePutUsuarioDto.senha = await bcrypt.hash(updatePutUsuarioDto.senha, salt);

    return this.usuarioRepository.update(id, updatePutUsuarioDto);
  }

  async updateParcial(id: number, updatePatchUsuarioDto: UpdatePatchUsuarioDTO) {
    await this.exists(id);

    if (updatePatchUsuarioDto.senha) {
      const salt = await bcrypt.genSalt();
      updatePatchUsuarioDto.senha = await bcrypt.hash(updatePatchUsuarioDto.senha, salt);  
    }
    return this.usuarioRepository.update(id, updatePatchUsuarioDto);
  }

  findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: number) {
    await this.exists(id);
    return this.usuarioRepository.findOneBy({id: id});
  }

  async remove(id: number) {
    await this.exists(id);

    return this.usuarioRepository.delete(id);
  }

  async exists(id: number) {
    

    if (!(this.usuarioRepository.exist({
      where: {
        id
      }
    }))){
      throw new NotFoundException("Usuário não existe!");
    }
  }
}
