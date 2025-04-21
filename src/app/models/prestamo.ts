export interface Prestamo {
    id_prestamo?: number;
    id_usuario: number;
    id_libro: number;
    fecha_prestamo: Date;
    fecha_devolucion: Date;
    estado: string;
}