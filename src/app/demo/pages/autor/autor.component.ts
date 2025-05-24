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
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";

  autorSelected: Autor;

  archivoExcel: File | null = null;
  mensajeRespuesta: string = '';
  erroresCarga: string[] = [];
    modalCargaMasivaInstance: any;
  respuestaModalInstance: any;

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
    this.cargarListaAutores();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.spinner.show();
    this.autorService.getAutores().subscribe({
      next: (data) => {
        console.log(data);
        this.autores = data;
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
    this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
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
    this.autorSelected = null;
  }

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: this.autorSelected.nombre,
      nacionalidad: this.autorSelected.nacionalidad,
      fechaNacimiento: this.autorSelected.fechaNacimiento
    });
  }

  guardarActualizarAutor() {
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

  abrirModalCargaMasiva() {
    const modalElement = document.getElementById('modalCargaMasiva');
    if (modalElement) {
      if (!this.modalCargaMasivaInstance) {
        this.modalCargaMasivaInstance = new bootstrap.Modal(modalElement);
      }
      this.modalCargaMasivaInstance.show();
    }
  }

  handleArchivoExcel(event: any) {
    const file = event.target.files[0];
    if (file && (file.type.includes('excel') || file.name.endsWith('.xls') || file.name.endsWith('.xlsx'))) {
      this.archivoExcel = file;
    } else {
      this.archivoExcel = null;
      alert('Por favor seleccione un archivo Excel válido (.xls o .xlsx)');
      event.target.value = '';
    }
  }

  procesarCargaMasiva() {
    if (!this.archivoExcel) {
      this.mensajeRespuesta = 'Debe seleccionar un archivo Excel válido.';
      this.abrirModalRespuesta();
      return;
    }

    this.spinner.show();
    this.msjSpinner = 'Cargando libros...';

    const formData = new FormData();
    formData.append('archivo', this.archivoExcel);

    this.autorService.postCargarMasivo(formData).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.msjSpinner = '';
        this.archivoExcel = null;
        this.modalCargaMasivaInstance?.hide();

        // Validar si el backend retornó errores en la respuesta
        if (response.errors && response.errors.length > 0) {
          this.erroresCarga = response.errors.map((e: any) =>
            typeof e === 'string' ? e : e.message || JSON.stringify(e)
          );
          this.mensajeRespuesta = response.mensaje || 'Se encontraron errores en la carga.';
        } else {
          // No hay errores
          this.erroresCarga = [];
          this.mensajeRespuesta = response.mensaje || 'Carga realizada con éxito.';
          // Refrescar libros
          this.cargarListaAutores();
        }
        this.resetInputFIle();
        this.abrirModalRespuesta();

      },
      error: (error) => {
        this.spinner.hide();
        this.msjSpinner = '';
        console.error(error);

        this.mensajeRespuesta = 'Error en el servidor. Intente más tarde.';
        this.erroresCarga = [];
        this.resetInputFIle();
        this.abrirModalRespuesta();

      }
    });
  }

  abrirModalRespuesta() {
    const modalElement = document.getElementById('respuestaModal');
    if (modalElement) {
      if (!this.respuestaModalInstance) {
        this.respuestaModalInstance = new bootstrap.Modal(modalElement);

        // Agregar listener para limpiar input al cerrar el modal
        modalElement.addEventListener('hidden.bs.modal', () => {
          this.resetInputFIle();
        });
      }
      this.respuestaModalInstance.show();
    }
  }

  resetInputFIle() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';  // Limpia el archivo seleccionado
    }
  }
}
