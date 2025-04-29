import { Usuario } from './usuario';
import { Libro } from './libro';


export interface Prestamo {
    idPrestamo?: number;
    idUsuario: number;
    nombre?: Usuario;
    idLibro: number;
    titulo?: Libro;
    fechaPrestamo: string;
    fechaDevolucion: string;
    estado: string;
    fechaEntrega?: string;
  }
  