import { Injectable } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
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
}
