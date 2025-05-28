/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PrestamoService } from './service/prestamo.service';
import { Prestamo } from 'src/app/models/prestamo';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './prestamo.component.html',
  styleUrls: ['./prestamo.component.scss'],
  providers: [DatePipe],
})
export class PrestamoComponent {
  modoEdicion: boolean = false;
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  libros: Libro[] = [];

  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = 'Cargando';

  prestamoSelected: Prestamo;

  form: FormGroup;

  constructor(
    private prestamoService: PrestamoService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) {
    this.cargarUsuarios();
    this.cargarLibros();
    this.cargarListaPrestamos();
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      idUsuario: ['', [Validators.required]],
      idLibro: ['', [Validators.required]],
      fechaPrestamo: ['', [Validators.required]],
      fechaDevolucion: ['', [Validators.required]],
      fechaEntrega: [''],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaPrestamos() {
    this.spinner.show();
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.prestamos.forEach((prestamo) => {
          const usuarioEncontrado = this.usuarios.find(
            (u) => u.idUsuario === prestamo.idUsuario
          );
          const libroEncontrado = this.libros.find(
            (l) => l.idLibro === prestamo.idLibro
          );
          prestamo['usuarioNombre'] = usuarioEncontrado
            ? usuarioEncontrado.nombre
            : 'N/A';
          prestamo['libroTitulo'] = libroEncontrado
            ? libroEncontrado.titulo
            : 'N/A';
        });
        this.spinner.hide();
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
        this.spinner.hide();
      },
    });
  }

  cargarUsuarios() {
    this.prestamoService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
      },
    });
  }

  cargarLibros() {
    this.prestamoService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
      },
    });
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal =
      modoForm === 'C' ? 'Crear Préstamo' : 'Editar Préstamo';

    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();

    if (modoForm === 'E') {
      this.modoEdicion = true;
      this.form.get('idUsuario')?.disable();
      this.form.get('idLibro')?.disable();
      this.form.get('fechaPrestamo')?.disable();
      this.form.get('fechaDevolucion')?.disable();
    } else {
      this.modoEdicion = false;
      this.form.get('idUsuario')?.enable();
      this.form.get('idLibro')?.enable();
      this.form.get('fechaPrestamo')?.enable();
      this.form.get('fechaDevolucion')?.enable();
    }

    const modalElement = document.getElementById('crearPrestamoModal');
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

    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null;
    }

    this.prestamoSelected = null;
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.crearPrestamoModal('E');
    this.prestamoSelected = prestamo;

    this.form.patchValue({
      idUsuario: prestamo.idUsuario,
      idLibro: prestamo.idLibro,
      fechaPrestamo: this.datePipe.transform(
        prestamo.fechaPrestamo,
        'yyyy-MM-dd'
      ),
      fechaDevolucion: this.datePipe.transform(
        prestamo.fechaDevolucion,
        'yyyy-MM-dd'
      ),
      fechaEntrega: this.datePipe.transform(
        prestamo.fechaEntrega,
        'yyyy-MM-dd'
      ),
    });
  }

  guardarActualizarPrestamo() {
    if (this.form.valid) {
      const rawValue = this.form.getRawValue();

      if (this.modoFormulario === 'C') {
        const nuevoPrestamo = {
          idUsuario: rawValue.idUsuario,
          idLibro: rawValue.idLibro,
          fechaPrestamo: this.datePipe.transform(
            rawValue.fechaPrestamo,
            'yyyy-MM-dd'
          ),
          fechaDevolucion: this.datePipe.transform(
            rawValue.fechaDevolucion,
            'yyyy-MM-dd'
          ),
          fechaEntrega: this.datePipe.transform(
            rawValue.fechaEntrega,
            'yyyy-MM-dd'
          ),
        };

        this.prestamoService.guardarPrestamo(nuevoPrestamo).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaPrestamos();
            this.cerrarModal();
          },
          error: (error) => {
            this.showMessage('Error', error.error.message, 'error');
          },
        });
      } else {
        const updatedPrestamo = {
          ...this.prestamoSelected,
          fechaEntrega: this.datePipe.transform(
            rawValue.fechaEntrega,
            'yyyy-MM-dd'
          ),
        };

        this.prestamoService.actualizarPrestamo(updatedPrestamo).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaPrestamos();
            this.cerrarModal();
          },
          error: (error) => {
            this.showMessage('Error', error.error.message, 'error');
          },
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
        popup: 'swal-overlay',
      },
      didOpen: () => {
        const swalPopup = document.querySelector('.swal2-popup');
        if (swalPopup) {
          (swalPopup as HTMLElement).style.zIndex = '1060';
        }
      },
    });
  }
}
