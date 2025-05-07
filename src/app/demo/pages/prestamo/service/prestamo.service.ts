import { Injectable } from '@angular/core';
<<<<<<< HEAD
=======
import { Observable } from 'rxjs';
import { Prestamo } from 'src/app/models/prestamo';
import { PrestamoRs } from 'src/app/models/prestamoRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8

@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

<<<<<<< HEAD
  constructor() { }
}
=======
  private api = `prestamo`;
  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService(){
  this.backendService.get(environment.apiUrl, this.api, "test");  
  }

  getPrestamos(): Observable<Prestamo[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar-prestamo");
  }

  guardarPrestamo(prestamo:Prestamo):Observable<PrestamoRs>{
    return this.backendService.post(environment.apiUrl, this.api,"prestar" ,prestamo)
  }  

  actualizarPrestamo(prestamo: Prestamo): Observable<PrestamoRs>{
    return this.backendService.post(environment.apiUrl, this.api, "devolucion-prestamo",prestamo)
  }  
}
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
