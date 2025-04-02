export interface Libro {
    id_libro?: number;
    titulo: string;
    id_autor: number;
    anio_publicacion: Date;
    categoria: string;
    existencias: number;
}