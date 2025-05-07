<<<<<<< HEAD
export class Autor {
    idAutor?: number;       
    nombre: string;          
    nacionalidad: string;      
    fechaNacimiento: Date;    
  }
=======
import { Nacionalidad } from "./nacionalidad";

export class Autor {
    idAutor: number;
    nombre: string;
    nacionalidad?: Nacionalidad;
    fechaNacimiento?: Date;
}
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
