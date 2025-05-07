import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { Autor} from 'src/app/models/autor';
import { AutorRs } from 'src/app/models/autorRs';

=======
import { Autor } from 'src/app/models/autor';
import { AutorRs } from 'src/app/models/autorRs';
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
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

<<<<<<< HEAD
  getAutor(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarAutor(libro: Autor): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", libro);
  }

  actualizarAutor(Autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", Autor);
=======
  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarAutor(autor: Autor): Observable<AutorRs> {
     console.log(autor);
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor);
  }

  actualizarAutor(autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
  }
}