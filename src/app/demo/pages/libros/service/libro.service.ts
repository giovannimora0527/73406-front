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
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getLibro(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarLibros(Libro: Libro): Observable<LibroRs> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-usuario", Libro);
  }

  actualizarLibro(Libro: Libro): Observable<LibroRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-usuario", Libro);
  }
}

