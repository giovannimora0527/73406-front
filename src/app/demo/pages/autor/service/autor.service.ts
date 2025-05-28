import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { Nacionalidad } from 'src/app/models/nacionalidad';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private api = `autor`;

  constructor(private backendService: BackendService) {}

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarAutor(autor: Autor): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor);
  }

  actualizarAutor(autor: Autor): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
  }

  // Método para obtener nacionalidades
  getNacionalidades(): Observable<Nacionalidad[]> {
    return this.backendService.get(environment.apiUrl, 'nacionalidad', 'listar');
  }

  // CARGA MASIVA DE AUTORES
cargarAutoresDesdeCSV(archivo: File): Observable<any> {
  const formData = new FormData();
  formData.append('archivo', archivo);
  return this.backendService.postFile(environment.apiUrl, this.api, "cargar-csv", formData);
}

}
