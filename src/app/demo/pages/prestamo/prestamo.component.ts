import { Component } from '@angular/core';
import { PrestamoService } from './service/prestamo.service';

@Component({
  selector: 'app-prestamo',
  imports: [],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss'
})
export class PrestamoComponent {

  constructor(private PrestamoService: PrestamoService) {
    this.PrestamoService.test();
  }

}
