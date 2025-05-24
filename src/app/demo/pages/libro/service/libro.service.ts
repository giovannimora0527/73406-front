import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Libro } from 'src/app/models/libro';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private readonly api = `libro`;
  
  constructor(private readonly backendService: BackendService) { 
   
  }

  getLibros(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  // Método para cargar libros desde un archivo CSV
  /**
   * Carga libros desde un archivo CSV
   * @param archivo Archivo CSV con los datos de los libros
   * @returns Observable con el resultado del procesamiento
   */
  cargarLibrosDesdeCSV(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    
    return this.backendService.postFile(environment.apiUrl, this.api, "cargar-csv", formData);
  }
}