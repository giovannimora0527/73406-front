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
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  Autores: Autor[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = 'Cargando autores...';

  AutorSelected: Autor | null = null;

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
    this.cargarFormulario();
    this.cargarListaAutores();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaAutores() {
    this.spinner.show();
    this.autorService.getAutor().subscribe({
      next: (data) => {
        this.Autores = data;
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
    this.titleModal = modoForm === 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
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
    this.form.setValue({
      nombre: '',
      nacionalidad: '',
      fechaNacimiento: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.AutorSelected = null;
  }

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
    this.AutorSelected = autor;
    this.form.patchValue({
      nombre: autor.nombre,
      nacionalidad: autor.nacionalidad,
      fechaNacimiento: autor.fechaNacimiento
    });
  }

  guardarActualizarAutor() {
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
      }
    }
  }

  public showMessage(title: string, text: string, icon: SweetAlertIcon) {
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

