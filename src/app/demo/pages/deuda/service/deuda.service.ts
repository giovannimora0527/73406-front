import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DeudaRs } from 'src/app/models/deudaRs';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeudaService {

  private readonly api = `deuda`;
  
  constructor(private readonly backendService: BackendService) { 
   
  }

  getDeudas(): Observable<DeudaRs> {
  return this.backendService.get(environment.apiUrl, this.api, 'listar');
  }
}