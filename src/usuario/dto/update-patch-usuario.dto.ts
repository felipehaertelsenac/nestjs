import { CreateUsuarioDTO } from "./create-usuario.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdatePatchUsuarioDTO extends PartialType(CreateUsuarioDTO) {
    
    
}