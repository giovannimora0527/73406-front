import { Usuario } from './usuario';
import { Libro } from './libro';
import { Prestamo } from './prestamo';

export class Deuda {
    idDeuda: number;
    usuario: Usuario;
    libro: Libro;
    prestamo: Prestamo;
    estado: string;
    valor: number;
    fechaPrestamo?: string;      
    fechaDevolucion?: string;    
}