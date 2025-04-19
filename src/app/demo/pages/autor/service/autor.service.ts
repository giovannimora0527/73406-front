import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = `autor`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }
  Auctor(autor: Autor): Observable<Autor> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor);
    
  }

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

}
