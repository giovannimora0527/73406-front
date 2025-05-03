import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

/**
 * Servicio para gestionar préstamos de libros
 */
@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private api = 'prestamos'; // Este endpoint lo ajustas si en backend es diferente

  /**
   * Constructor del servicio
   * @param backendService Servicio para comunicación con el backend
   */
  constructor(private backendService: BackendService) {}

  /**
   * Obtiene la lista de todos los préstamos
   * @returns Observable con la lista de préstamos
   */
  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }

  /**
   * Crea un nuevo préstamo
   * @param prestamo Información del préstamo a crear
   * @returns Observable con la respuesta del servidor
   */
  guardarPrestamo(prestamo: any): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, 'crear', prestamo);
  }

  /**
   * Actualiza un préstamo existente
   * @param id ID del préstamo a actualizar
   * @param prestamo Información actualizada del préstamo
   * @returns Observable con la respuesta del servidor
   */
  actualizarPrestamo(id: number, prestamo: any): Observable<any> {
    return this.backendService.put(environment.apiUrl, this.api, `actualizar/${id}`, prestamo);
  }

  /**
   * Obtiene la lista de libros disponibles para préstamo
   * @returns Observable con la lista de libros disponibles
   */
  getLibrosDisponibles(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'librosDisponibles');
  }

  /**
   * Obtiene la lista de usuarios del sistema
   * @returns Observable con la lista de usuarios
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrl, "usuario", "listar");
  }
}