import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { AutorRs } from 'src/app/models/autorRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private readonly api = 'autor';

  constructor(private readonly backendService: BackendService) {
    this.testService();
  }

  // Método de prueba
  testService() {
    this.backendService.get(environment.apiUrl, this.api, 'test');
  }

  // Obtener todos los autores
  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }

  // Guardar un nuevo autor
  guardarAutor(autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, 'guardar-Autor', autor);
  }

  // Actualizar un autor existente
  actualizarAutor(autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, 'actualizar-Autor', autor);
  }
}
