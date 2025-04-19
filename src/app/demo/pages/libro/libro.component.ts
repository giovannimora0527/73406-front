/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {FormBuilder,FormControl,FormGroup,Validators,FormsModule,ReactiveFormsModule,AbstractControl} from '@angular/forms';
import { Autor } from 'src/app/models/autor';
import { AutorService } from '../autor/service/autor.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {
  msjSpinner: string = 'Cargando';
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  libroSelected: Libro;
  libros: Libro[] = [];
  autores: Autor[] = [];
  categorias: any;

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    autorId: new FormControl(''),
    anioPublicacion: new FormControl(''),
    categoriaId: new FormControl(''),
    existencias: new FormControl('')
  });

  constructor(
    private readonly libroService: LibroService,
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly autorService: AutorService
  ) {
    this.getLibros();
    this.cargarFormulario();
    this.getAutores();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      autorId: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      existencias: ['', [Validators.required]],
    });
  }

  getLibros() {
    this.spinner.show();
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.spinner.hide();
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  getAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Libro' : 'Editar Libro';
    const modalElement = document.getElementById('crearModal');
    modalElement?.blur();
    modalElement?.setAttribute('aria-hidden', 'false');

    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  abrirModoEdicion(libro: Libro) {
    this.crearModal('E');
    this.libroSelected = libro;
    this.form.patchValue({
      titulo: libro.titulo,
      autorId: libro.autor,
      anioPublicacion: libro.anioPublicacion,
      categoriaId: libro.categoria,
      existencias: libro.existencias
    });
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.reset({
      titulo: '',
      autorId: '',
      anioPublicacion: '',
      categoriaId: '',
      existencias: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.libroSelected = null;
  }

  guardarActualizar() {
    if (this.form.valid) {
      this.spinner.show();
      if (this.modoFormulario === 'C') {
        // Crear libro
        this.libroService.crearLibro(this.form.getRawValue()).subscribe({
          next: (data) => {
            this.showMessage('Éxito', 'Libro creado correctamente', 'success');
            this.cerrarModal();
            this.getLibros();
            this.spinner.hide();
          },
          error: (err) => {
            this.showMessage('Error', err.error.message, 'error');
            this.spinner.hide();
          }
        });
      } else {
        // Editar libro
        const libroActualizado: Libro = {
          ...this.libroSelected,
          ...this.form.getRawValue()
        };
        this.libroService.actualizarLibro(libroActualizado).subscribe({
          next: (data) => {
            this.showMessage('Éxito', 'Libro actualizado correctamente', 'success');
            this.cerrarModal();
            this.getLibros();
            this.spinner.hide();
          },
          error: (err) => {
            this.showMessage('Error', err.error.message, 'error');
            this.spinner.hide();
          }
        });
      }
    } else {
      this.showMessage('Formulario inválido', 'Por favor completa todos los campos obligatorios.', 'warning');
    }
  }

  showMessage(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar',
      customClass: {
        container: 'position-fixed',
        popup: 'swal-overlay'
      },
      didOpen: () => {
        const swalPopup = document.querySelector('.swal2-popup');
        if (swalPopup) {
          (swalPopup as HTMLElement).style.zIndex = '1060';
        }
      }
    });
  }
}
