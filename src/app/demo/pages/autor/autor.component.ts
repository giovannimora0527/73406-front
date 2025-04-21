import { Component } from '@angular/core';
<<<<<<< HEAD
=======
import { AutorService } from './service/autor.service';
>>>>>>> d09bdfa (Ajustes de modulos)

@Component({
  selector: 'app-autor',
  imports: [],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {

<<<<<<< HEAD
=======
  constructor(private autorService: AutorService) {
    this.autorService.test();
  }
>>>>>>> d09bdfa (Ajustes de modulos)
}
