import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/models/usuario';
<<<<<<< HEAD
=======
import { UsuarioRs } from 'src/app/models/usuarioRs';
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private api = `usuario`;

  constructor(private backendService: BackendService) { 
    this.testService();
  }

  testService() {
<<<<<<< HEAD
    this.backendService.get(environment.apiUrlAuth, this.api, "test");
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrlAuth, this.api, "listar");
  }
}
=======
    this.backendService.get(environment.apiUrl, this.api, "test");
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.backendService.get(environment.apiUrl, this.api, "listar");
  }

  guardarUsuario(usuario: Usuario): Observable<UsuarioRs> {
    return this.backendService.post(environment.apiUrl, this.api, "guardar-usuario", usuario);
  }

  actualizarUsuario(usuario: Usuario): Observable<UsuarioRs> {
    return this.backendService.post(environment.apiUrl, this.api, "actualizar-usuario", usuario);
  }
}
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
