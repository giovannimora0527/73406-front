import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
=======
import { Libro } from 'src/app/models/libro';
import { LibroRs } from 'src/app/models/libroRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
>>>>>>> 89292445c23e12c13fe1155109a7559abc42b087

@Injectable({
  providedIn: 'root'
})
export class LibroService {
<<<<<<< HEAD
  urlapi = environment.apiUrl;

  constructor(private backendService: BackendService) {
    this.test();
  }

  test() {
    this.backendService.get(this.urlapi, "app", "test").subscribe(
      {
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }
}
=======
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

>>>>>>> 89292445c23e12c13fe1155109a7559abc42b087
