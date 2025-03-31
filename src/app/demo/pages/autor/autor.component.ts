import { Component } from '@angular/core';
import { AutorService } from './service/autor.service';

@Component({
  selector: 'app-autor',
  imports: [],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {

  constructor(private autorService: AutorService) {
    this.autorService.test();
  }
}
