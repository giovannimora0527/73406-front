import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {
  private api = 'prestamo'; // Este endpoint lo ajustas si en backend es diferente

  constructor(private backendService: BackendService) {}

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }

  guardarPrestamo(prestamo: Prestamo): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, 'guardar-prestamo', prestamo);
  }

  actualizarPrestamo(prestamo: Prestamo): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, 'actualizar-prestamo', prestamo);
  }

  
    // Método para obtener nacionalidades
    getLibros(): Observable<Libro[]> {
      return this.backendService.get(environment.apiUrl, 'libro', 'listar');

    }
    getUsuarios(): Observable<Usuario[]> {
      return this.backendService.get(environment.apiUrl, "usuario", "listar");
    }

  }
