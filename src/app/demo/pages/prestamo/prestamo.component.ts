import { Component } from '@angular/core';
import { prestamoService } from './service/prestamo.service';

@Component({
  selector: 'app-prestamo',
  imports: [],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class prestamoComponent {

  constructor(private prestamoService: prestamoService) {
    this.prestamoService.test();
  }
}
