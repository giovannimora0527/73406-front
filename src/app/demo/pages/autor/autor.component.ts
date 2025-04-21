// src/app/demo/pages/autor/autor.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Autor } from 'src/app/models/autor';
import { AutorService } from './service/autor.service';

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss']
})
export class AutorComponent implements OnInit {
  autores: Autor[] = [];

  constructor(private autorService: AutorService) {}

  ngOnInit(): void {
    this.cargarAutores();
  }

  private cargarAutores(): void {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        console.log('Autores recibidos:', data);
        this.autores = data;
      },
      error: (err) => {
        console.error('Error al cargar autores:', err);
      }
    });
  }
}
