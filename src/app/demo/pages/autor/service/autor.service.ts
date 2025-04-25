import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor } from 'src/app/models/Autor';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
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

