import { Injectable } from '@angular/core';
<<<<<<< HEAD

@Injectable({
providedIn: 'root'
})
export class LibroService {
constructor() {}

  test() {
    console.log('Servicio de libro funcionando');
  }
}
=======
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
  getLibrosDisponibles(): Observable<Libro[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar-disponibles");
  }
}
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
