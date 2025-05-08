<<<<<<< HEAD
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/Autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';

declare const bootstrap: any;

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
<<<<<<< HEAD
  Autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = 'Cargando autores...';

  AutorSelected: Autor | null = null;
=======
  autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";

  autorSelected: Autor;
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
<<<<<<< HEAD
    this.cargarFormulario();
    this.cargarListaAutores();
=======
    this.cargarListaAutores();
    this.cargarFormulario();
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
<<<<<<< HEAD
      fechaNacimiento: ['', [Validators.required]],
=======
      fechaNacimiento: ['', [Validators.required]]
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.spinner.show();
<<<<<<< HEAD
    this.autorService.getAutor().subscribe({
      next: (data) => {
        this.Autores = data;
=======
    this.autorService.getAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
        this.spinner.hide();
      },
      error: (error) => {
        Swal.fire('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
<<<<<<< HEAD
    this.titleModal = modoForm === 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      modalElement.setAttribute('aria-hidden', 'false');
=======
    this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
      if (!this.modalInstance) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
<<<<<<< HEAD
    this.form.setValue({
=======
    this.form.reset({
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
      nombre: '',
      nacionalidad: '',
      fechaNacimiento: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
<<<<<<< HEAD
    this.AutorSelected = null;
=======
    this.autorSelected = null;
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
  }

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
<<<<<<< HEAD
    this.AutorSelected = autor;
    this.form.patchValue({
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
      fechaNacimiento: autor.fechaNacimiento
=======
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: this.autorSelected.nombre,
      nacionalidad: this.autorSelected.nacionalidad,
      fechaNacimiento: this.autorSelected.fechaNacimiento
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
    });
  }

  guardarActualizarAutor() {
<<<<<<< HEAD
    if (this.form.valid) {
      if (this.modoFormulario === 'C') {
        this.autorService.guardarAutor(this.form.getRawValue())
          .subscribe({
            next: (data) => {
              this.showMessage("Éxito", data.message, "success");
              this.cargarListaAutores();
              this.cerrarModal();
            },
            error: (error) => {
              this.showMessage("Error", error.error.message, "error");
            }
          });
      } else if (this.AutorSelected) {
        const idAutor = this.AutorSelected.idAutor;
        const autorActualizado = {
          ...this.AutorSelected,
          ...this.form.getRawValue(),
          idAutor: idAutor
        };

        this.autorService.actualizarAutor(autorActualizado)
          .subscribe({
            next: (data) => {
              this.showMessage("Éxito", data.message, "success");
              this.cargarListaAutores();
              this.cerrarModal();
            },
            error: (error) => {
              this.showMessage("Error", error.error.message, "error");
            }
          });
=======
    console.log(this.form.valid);
    if (this.form.valid) {
      console.log('El formulario es válido');
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un autor nuevo');
        this.autorService.guardarAutor(this.form.getRawValue())
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
            this.cerrarModal(); 
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
      } else {
        console.log('Actualizamos un autor existente');
        // Actualizar solo los campos específicos
        const idAutor = this.autorSelected.idAutor;
        this.autorSelected = {
          ...this.autorSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.autorSelected.idAutor = idAutor;
        console.log(this.autorSelected);    
        this.autorService.actualizarAutor(this.autorSelected)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
            this.cerrarModal();             
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
      }
    }
  }

  public showMessage(title: string, text: string, icon: SweetAlertIcon) {
    Swal.fire({
<<<<<<< HEAD
      title,
      text,
      icon,
      confirmButtonText: 'Aceptar',
=======
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Aceptar',      
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
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
<<<<<<< HEAD
}

=======
}
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
