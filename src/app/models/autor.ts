import { Nacionalidad } from "./nacionalidad";

export class Autor {
    idAutor?: number;
    nombre: string;
    correo?: string;
    telefono?: string;
    fechaRegistro?: Date;
    activo?: boolean;
    nacionalidad?: Nacionalidad;
    fechaNacimiento?: Date;
}
