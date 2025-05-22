import { Usuario } from './usuario';
import { Libro } from './libro';
import { Prestamo } from './prestamo';

export class Deuda {
    idDeuda: number;
    usuario: Usuario;
    libro: Libro;
    prestamo: Prestamo;
    estado: string;
    monto: number;
    fechaPrestamo?: string;      // opcional, por si lo traes de Prestamo
    fechaDevolucion?: string;    // opcional, por si lo traes de Prestamo
    fechaCancelacion?: string;   // adicional si el backend la entrega
}
