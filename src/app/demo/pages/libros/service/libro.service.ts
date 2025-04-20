import { Injectable } from '@angular/core';
import { Libro } from 'src/app/models/libro';
import { LibroRs } from 'src/app/models/libroRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private api = "libro";

  constructor(private backendService: BackendService) {
    this.testService();
  }

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
