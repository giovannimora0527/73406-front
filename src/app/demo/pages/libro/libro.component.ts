import { Component } from '@angular/core';
import { libroService } from './service/libro.service';

@Component({
  selector: 'app-autor',
  imports: [],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class libroComponent {

  constructor(private libroService: libroService) {
    this.libroService.test();
  }
}
