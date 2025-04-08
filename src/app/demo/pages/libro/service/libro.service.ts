import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class LibroService {
constructor() {}

  test() {
    console.log('Servicio de libro funcionando');
  }
}
