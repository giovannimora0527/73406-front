/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common'

declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss',
  providers: [DatePipe]
})
export class AutorComponent {
  autores: Autor[] = [];
  nacionalidad: any[] = [];

  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";

  autorSelected: Autor;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidad: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
      ) {
    this.cargarListaAutores();
    this.cargarFormulario();
    this.cargarNacionalidades();

  }
  


  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: [null, [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  

  cargarListaAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        this.spinner.hide();
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  cargarNacionalidades() {
    this.autorService.getNacionalidades().subscribe({
      next: (data) => {
        this.nacionalidad = data;
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      modalElement.blur();
      modalElement.setAttribute('aria-hidden', 'false');
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
      nacionalidadId: '',
      fechaNacimiento: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: this.autorSelected.nombre,
      nacionalidad: this.autorSelected.nacionalidad.nombre,
      fechaNacimiento: this.datePipe.transform(this.autorSelected.fechaNacimiento, 'yyyy-MM-dd')
    });
  }

  guardarActualizarAutor() {
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        // Transformar fecha
          const formValue = this.form.getRawValue();
          formValue.fechaNacimiento = this.datePipe.transform(
            formValue.fechaNacimiento,
            'yyyy-MM-dd'
          );
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
      } else {
        const idAutor = this.autorSelected.idAutor;
        this.autorSelected = {
          ...this.autorSelected,
          ...this.form.getRawValue()
        };
        this.autorSelected.idAutor = idAutor;
        this.autorService.actualizarAutor(this.autorSelected)
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
}