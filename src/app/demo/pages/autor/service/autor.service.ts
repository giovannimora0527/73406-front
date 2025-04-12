import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { Autor} from 'src/app/models/autor';
import { AutorRs } from 'src/app/models/autorRs';

=======
import { Autor } from 'src/app/models/autor';
>>>>>>> 85129fd29e1c41ae93d4283f407c46fed9816959
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
<<<<<<< HEAD
  private api = `Autor`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getAutor(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarAutor(Autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-Autor", Autor);
  }

  actualizarAutor(Autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-Autor", Autor);
=======
  api = "autor";

  constructor(private readonly backendService: BackendService) {
    
  }

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
>>>>>>> 85129fd29e1c41ae93d4283f407c46fed9816959
  }
}
