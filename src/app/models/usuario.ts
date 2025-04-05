export class Usuario {
    UsuarioId?: number;
    nombre!: string;
    correo: string;
    telefono?: string;
    fechaRegistro?: Date;
    activo?: boolean;
}