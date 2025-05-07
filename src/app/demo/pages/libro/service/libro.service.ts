import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
<<<<<<< HEAD
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
=======

  private readonly api = `libro`;
  
  constructor(private readonly backendService: BackendService) { 
   
  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }
  getLibrosDisponibles(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar-disponibles");
  }
}
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
