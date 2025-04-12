<<<<<<< HEAD
export class Autor {
    idAutor?: number;
    nombre: string;
    correo: string;
    telefono?: string;
    fechaRegistro?: Date;
    activo?: boolean;
=======
import { Nacionalidad } from "./nacionalidad";

export class Autor {
    idAutor: number;
    nombre: string;
    nacionalidad?: Nacionalidad;
    fechaNacimiento?: Date;
>>>>>>> 85129fd29e1c41ae93d4283f407c46fed9816959
}