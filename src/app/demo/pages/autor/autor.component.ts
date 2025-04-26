// src/app/demo/pages/autor/autor.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Autor } from 'src/app/models/autor';
import { AutorService } from './service/autor.service';

declare const bootstrap: any;   // <— así accedemos a Bootstrap

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.scss']
})
export class AutorComponent implements OnInit {
  autores: Autor[] = [];
  form: FormGroup;
  titleModal = '';
  modoCrear = true;
  autorSeleccionado: Autor | null = null;
  private modalInstance: any;

  constructor(
    private autorService: AutorService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarAutores();
  }

  cargarAutores(): void {
    this.autorService.getAutores().subscribe({
      next: data => this.autores = data,
      error: err => console.error(err)
    });
  }

  crearAutorModal(): void {
    this.modoCrear = true;
    this.titleModal = 'Nuevo Autor';
    this.autorSeleccionado = null;
    this.form.reset();
    this.openModal();
  }

  editarAutorModal(autor: Autor): void {
    this.modoCrear = false;
    this.titleModal = 'Editar Autor';
    this.autorSeleccionado = autor;
    this.form.patchValue({
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
      fechaNacimiento: autor.fechaNacimiento ? new Date(autor.fechaNacimiento).toISOString().substring(0,10) : ''
    });
    this.openModal();
  }

  guardarActualizarAutor(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Autor = {
      idAutor: this.autorSeleccionado?.idAutor ?? 0,
      nombre: this.form.value.nombre,
      nacionalidad: this.form.value.nacionalidad,
      fechaNacimiento: new Date(this.form.value.fechaNacimiento)
    };

    const obs = this.modoCrear
      ? this.autorService.agregarAutor(payload)
      : this.autorService.actualizarAutor(payload);

    obs.subscribe({
      next: () => {
        this.cargarAutores();
        this.closeModal();
      },
      error: err => console.error(err)
    });
  }

  public openModal(): void {
    const modalEl = document.getElementById('autorModal');
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(modalEl);
    }
    this.modalInstance.show();
  }

  public closeModal(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }
}
