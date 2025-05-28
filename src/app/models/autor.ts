import { Nacionalidad } from "./nacionalidad";

export interface Autor {
    idAutor?: number;
    nombre: string;
    nacionalidad?: Nacionalidad;
    fechaNacimiento?: string
    nacionalidadId: number;
}