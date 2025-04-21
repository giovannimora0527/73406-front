import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = 'autor';

  constructor(private readonly backendService: BackendService) {}

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }

  agregarAutor(autor: Autor): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, 'guardar', autor);
  }

  actualizarAutor(autor: Autor): Observable<any> {
    return this.backendService.put(environment.apiUrl, this.api, 'actualizar', autor);
  }
}
