/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';

import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Autor } from 'src/app/models/autor';
import { AutorService } from '../autor/service/autor.service';
import { Categoria } from 'src/app/models/categoria';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormGroupDirective } from '@angular/forms'; 
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [NgxSpinnerModule, ReactiveFormsModule, NgxSpinnerModule, FormsModule, CommonModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  libroSelected: Libro;

  libros: Libro[] = [];
  autores: Autor[] = [];

  form: FormGroup = new FormGroup({
    titulo: new FormControl(''),
    autorId: new FormControl(''),
    anioPublicacion: new FormControl(''),
    CategoriaId: new FormControl(''),
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

  getAutores() {
    this.autorService.getAutor().subscribe(
      {
        next: (data) => {         
          this.autores = data;
        },
        error: (error) => {
          console.log(error);
        },
      }
    );
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      autorId: ['', [Validators.required]],
      anioPublicacion: ['', [Validators.required]],
      CategoriaId: [true, [Validators.required]],
      existencias: [true, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => {        
        this.libros = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Libro' : 'Editar Libro';
    const modalElement = document.getElementById('crearModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
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
      titulo: this.libroSelected.titulo,
      autorId: this.libroSelected.autor,
      aniopublicacion: this.libroSelected.anioPublicacion,
      Categoriaid: this.libroSelected.categoria,
      existencias: this.libroSelected.existencias
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
      existencias: '',
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.libroSelected = null;
  }
  guardarActualizar() {
    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        console.log('Creamos un libro nuevo');
        this.libroService.guardarLibro(this.form.getRawValue()).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.getLibros();
            this.cerrarModal();
          },
          error: (error) => {
            console.log(error);
            this.showMessage('Error', error.error.message, 'error');
          }
        });
      } else {
        console.log('Actualizamos un libro existente');
        this.libroSelected = {
          ...this.libroSelected,
          ...this.form.getRawValue()
        };
        this.libroService.actualizarLibro(this.libroSelected).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.getLibros();
            this.cerrarModal();
          },
          error: (error) => {
            console.log(error);
            this.showMessage('Error', error.error.message, 'error');
          }
        });
      }
    } else {
      this.showMessage('Error', 'Por favor, complete todos los campos correctamente.', 'error');
    }
  }

  public showMessage(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
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
