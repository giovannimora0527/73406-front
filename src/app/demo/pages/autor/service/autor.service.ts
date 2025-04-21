import { Injectable } from '@angular/core';
<<<<<<< HEAD
=======
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';
>>>>>>> d09bdfa (Ajustes de modulos)

@Injectable({
  providedIn: 'root'
})
export class AutorService {
<<<<<<< HEAD

  constructor() { }
=======
  urlApi = environment.apiUrl;

  constructor(private backendService: BackendService) {
    this.test();
  }

  test() {
    this.backendService.get(this.urlApi, "app", "test").subscribe(
      {
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.log(error);
        }
      }
    );
  }
>>>>>>> d09bdfa (Ajustes de modulos)
}
