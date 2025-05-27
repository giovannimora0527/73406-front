import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deuda } from 'src/app/models/deuda';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  private readonly api = `deuda`;
  
  constructor(private readonly backendService: BackendService) {}

  buscarDeudasPorUsuario(nombreUsuario: string): Observable<Deuda[]> {
    return this.backendService.post(environment.apiUrl, this.api, 'buscarDeudor', {
      nombreUsuario: nombreUsuario
    });
  }

  pagarDeuda(idDeuda: number): Observable<any> {
    return this.backendService.post(environment.apiUrl, this.api, 'pagarDeuda', {
      idDeuda: idDeuda
    });
  }
}
