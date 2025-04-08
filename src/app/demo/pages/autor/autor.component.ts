import { Component } from '@angular/core';
import { AutorService } from './service/autor.service';

@Component({
selector: 'app-autor',
templateUrl: './autor.component.html',
styleUrls: ['./autor.component.scss']
})
export class AutorComponent {
constructor(private autorService: AutorService) {
    this.autorService.test();
  }
}
