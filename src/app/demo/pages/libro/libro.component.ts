/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Libro } from 'src/app/models/libro';
import { LibroService } from './service/libro.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Autor } from 'src/app/models/autor';
import { AutorService } from '../autor/service/autor.service';

declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [NgxSpinnerModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modalCargaMasivaInstance: any;
  respuestaModalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  mensajeRespuesta: string = '';
  erroresCarga: string[] = [];

  libroSelected: Libro;
  libros: Libro[] = [];
  autores: Autor[] = [];

  archivoExcel: File | null = null;

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
    this.getAutores();
    this.cargarFormulario();
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
    this.libroService.getLibros().subscribe({
      next: (data) => this.libros = data,
      error: (error) => console.error(error)
    });
  }

  getAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => this.autores = data,
      error: (error) => console.error(error)
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Libro' : 'Editar Libro';
    const modalElement = document.getElementById('crearModal');
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
    this.form.patchValue(libro);
  }

  cerrarModal() {
    this.form.reset();
    this.modalInstance?.hide();
    this.libroSelected = null;
  }

  guardarActualizar() {
    console.log("Entro a guardar o actualizar");
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

    this.libroService.postCargarMasivo(formData).subscribe({
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
          this.getLibros();
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
