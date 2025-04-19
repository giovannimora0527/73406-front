import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  constructor(private backendService: BackendService) { 
    this.testService();
  }
  
  crearLibro(libro: Libro): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "crear-libro", libro);
  }
  private api = 'libro';


  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get<Libro[]>(environment.apiUrl, this.api, "listar");
  }

  guardarLibro(libro: Libro): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-libro", libro);
  }

  actualizarLibro(libro: Libro): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-libro", libro);
  }
}
