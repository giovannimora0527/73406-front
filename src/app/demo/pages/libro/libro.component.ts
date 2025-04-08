import { Component } from '@angular/core';
import { LibroService } from './service/libro.service';

@Component({
selector: 'app-libro',
templateUrl: './libro.component.html',
styleUrls: ['./libro.component.scss']
})
export class LibroComponent {
constructor(private libroService: LibroService) {
    this.libroService.test();
  }
}

