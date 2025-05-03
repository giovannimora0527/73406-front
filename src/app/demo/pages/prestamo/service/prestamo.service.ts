import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoRs } from 'src/app/models/prestamoRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private api = `prestamo`;
  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService(){
  this.backendService.get(environment.apiUrl, this.api, "test");  
  }

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarPrestamo(prestamo:Prestamo):Observable<PrestamoRs>{
    return this.backendService.post(environment.apiUrl, this.api,"guardar-prestamo" ,prestamo)
  }  

  actualizarPrestamo(prestamo: Prestamo): Observable<PrestamoRs>{
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-prestamo",prestamo)
  }  
}