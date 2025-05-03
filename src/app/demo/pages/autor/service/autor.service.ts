import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { AutorRs } from 'src/app/models/autorRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Nacionalidad } from 'src/app/models/nacionalidad';



@Injectable({
  providedIn: 'root'
})
export class AutorService {
  api = `autor`;

  constructor(private readonly backendService: BackendService) {}

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }
  getNacionalidades(): Observable<Nacionalidad[]> {
    return this.backendService.get(environment.apiUrl, 'autor', 'listarnacionalidad');    
  }
  getNacionalidad(): Observable<any[]> {
    return this.backendService.get(environment.apiUrl, 'autor', 'listar-por-nacionalidad');
  }

  guardarAutor(autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor);
  }

  actualizarAutor(autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
  }
}