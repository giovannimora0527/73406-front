import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class AutorService {
constructor() {}

  test() {
    console.log('Servicio de Autor funcionando');
  }
}
