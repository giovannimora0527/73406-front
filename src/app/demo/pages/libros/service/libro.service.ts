import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private readonly api = `libro`;
  
  constructor(private readonly backendService: BackendService) { 
   
  }

<<<<<<< HEAD
  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test").subscribe({
      next: (data) => console.log(data),
      error: (error) => console.error(error)
    });
  }

  getLibro(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarLibros(libro: Libro): Observable<LibroRs> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-usuario", libro);
  }

  actualizarLibro(libro: Libro): Observable<LibroRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-usuario", libro);
  }
}
=======
  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }
  getLibrosDisponibles(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar-disponibles");
  }
}
>>>>>>> 93388edb1f30850556f6a86be438c61b8bfd57c1
