import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class PrestamoService {
constructor() {}

  test() {
    console.log('Servicio de préstamo funcionando');
  }
}
