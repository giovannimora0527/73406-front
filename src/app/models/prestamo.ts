import { Usuario } from './usuario';
import { Libro } from './libro';


export interface Prestamo {
    idPrestamo?: number;
    usuario?: Usuario;
    idUsuario: number;
    libro?: Libro;
    idLibro: number;
    fechaPrestamo: string;
    fechaDevolucion: string;
    estado?: string;
    fechaEntrega?: string;
    tituloLibro: string;
    nombreUsuario: string;
  }
  