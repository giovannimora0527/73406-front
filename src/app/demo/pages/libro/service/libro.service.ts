import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private readonly api = `libro`; // Ruta de la API

  constructor(private readonly backendService: BackendService) { }

  // Método para obtener los libros
  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  // Método para guardar un nuevo libro
  guardarLibro(libro: Libro): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-libro", libro);
  }
  
  // Método para actualizar un libro existente
  actualizarLibro(libro: Libro): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-libro", libro);
  }
  
}
