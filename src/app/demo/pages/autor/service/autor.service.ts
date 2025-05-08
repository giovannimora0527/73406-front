import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/Autor';
=======
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/autor';
import { AutorRs } from 'src/app/models/autorRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8

@Injectable({
  providedIn: 'root'
})
export class AutorService {
<<<<<<< HEAD
  private apiUrl = 'http://localhost:3000/api/autores'; // Cambia esta URL si es necesario

  constructor(private http: HttpClient) {}


  getAutor(): Observable<Autor[]> {
    return this.http.get<Autor[]>(this.apiUrl);
  }

  guardarAutor(autor: Autor): Observable<any> {
    return this.http.post(this.apiUrl, autor);
  }


  actualizarAutor(autor: Autor): Observable<any> {
    return this.http.put(`${this.apiUrl}/${autor.idAutor}`, autor);
  }


  eliminarAutor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

=======
  private api = `autor`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getAutores(): Observable<Autor[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarAutor(autor: Autor): Observable<AutorRs> {
     console.log(autor);
    return this.backendService.post(environment.apiUrl, this.api, "guardar-autor", autor);
  }

  actualizarAutor(autor: Autor): Observable<AutorRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-autor", autor);
  }
}
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
