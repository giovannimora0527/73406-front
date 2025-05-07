<<<<<<< HEAD
import { Component } from '@angular/core';
import { AutorService } from './service/autor.service';
import { CommonModule } from '@angular/common';
import { Autor } from 'src/app/models/autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
<<<<<<< HEAD
  Autores: Autor[] = [];
=======
  autores: Autor[] = [];
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";

<<<<<<< HEAD
  AutorSelected: Autor;
=======
  autorSelected: Autor;
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
<<<<<<< HEAD
    fechaNacimiento: new FormControl(''),
=======
    fechaNacimiento: new FormControl('')
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cargarListaAutores();
    this.cargarFormulario();
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
        console.log(data);
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
=======
    this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
    const modalElement = document.getElementById('crearAutorModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
<<<<<<< HEAD
=======
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
    this.form.reset({
      nombre: '',
      nacionalidad: '',
      fechaNacimiento: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
<<<<<<< HEAD
    this.AutorSelected = null;
  }

  abrirModoEdicion(Autor: Autor) {
    this.crearAutorModal('E');
    this.AutorSelected = Autor;
    this.form.patchValue({
      nombre: this.AutorSelected.nombre,
      nacionalidad: this.AutorSelected.nacionalidad,
      fechaNacimiento: this.AutorSelected.fechaNacimiento
=======
    this.autorSelected = null;
  }

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
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
      console.log('El formulario es válido');
      
      if (this.modoFormulario === 'C') {
=======
    console.log(this.form.valid);
    if (this.form.valid) {
      console.log('El formulario es válido');
      if (this.modoFormulario.includes('C')) {
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
        console.log('Creamos un autor nuevo');
        this.autorService.guardarAutor(this.form.getRawValue())
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
<<<<<<< HEAD
            this.cerrarModal();
=======
            this.cerrarModal(); 
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
      } else {
        console.log('Actualizamos un autor existente');
<<<<<<< HEAD
        const idAutor = this.AutorSelected.idAutor;
        this.AutorSelected = {
          ...this.AutorSelected,
          ...this.form.getRawValue()
        };
        this.AutorSelected.idAutor = idAutor;

        this.autorService.actualizarAutor(this.AutorSelected)
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
=======
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 9489ceba2a824d071832fa6b6fae69dcc63feca8
