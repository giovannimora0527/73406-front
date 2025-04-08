import { Component } from '@angular/core';
import { PrestamoService } from './service/prestamo.service';

@Component({
selector: 'app-prestamo',
templateUrl: './prestamo.component.html',
styleUrls: ['./prestamo.component.scss']
})
export class PrestamoComponent {
constructor(private prestamoService: PrestamoService) {
    this.prestamoService.test();
  }
}
