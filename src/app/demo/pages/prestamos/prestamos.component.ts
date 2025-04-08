import { Component } from '@angular/core';
import { PrestamosService } from './serivice/prestamos.service';

@Component({
  selector: 'app-prestamos',
  imports: [],
  templateUrl: './prestamos.component.html',
  styleUrl: './prestamos.component.scss'
})
export class PrestamosComponent {
  constructor( private prestamosService: PrestamosService){
    this.prestamosService.test();
  }

}
