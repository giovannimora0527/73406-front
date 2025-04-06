import { Component } from '@angular/core';
import { LibroService } from './service/libro.service';

@Component({
  selector: 'app-libro',
  imports: [],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {

  constructor(private LibroService: LibroService) {
    this.LibroService.test();
  }
}
