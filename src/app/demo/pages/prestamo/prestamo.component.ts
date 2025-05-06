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
  AbstractControl,
  FormsModule,
  ReactiveFormsModule
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
  providers: [DatePipe]
})
export class PrestamoComponent {
  modoEdicion = false;
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  modalInstance: any;
  modoFormulario = '';
  titleModal = '';
  msjSpinner = 'Cargando';
  prestamoSelected: Prestamo;
  form: FormGroup;
  fechaActual = new Date()

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
// En el método cargarFormulario()
cargarFormulario() {
  this.form = this.formBuilder.group({
    idUsuario: ['', Validators.required],
    idLibro: ['', Validators.required],
    fechaDevolucion: ['', Validators.required],
    fechaEntrega: ['']
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
          const usuario = this.usuarios.find(u => u.idUsuario === prestamo.idUsuario);
          const libro = this.libros.find(l => l.idLibro === prestamo.idLibro);
          prestamo['usuarioNombre'] = usuario?.nombre || 'N/A';
          prestamo['libroTitulo'] = libro?.titulo || 'N/A';
        });
        this.spinner.hide();
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  cargarUsuarios() {
    this.prestamoService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => this.showMessage('Error', error.error.message, 'error')
    });
  }

  cargarLibros() {
    this.prestamoService.getLibros().subscribe({
      next: (data) => this.libros = data,
      error: (error) => this.showMessage('Error', error.error.message, 'error')
    });
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Préstamo' : 'Editar Préstamo';
    this.form.reset();

    if (modoForm === 'E') {
      this.form.addControl('estado', new FormControl('', Validators.required));
      this.form.get('idUsuario')?.disable();
      this.form.get('idLibro')?.disable();

      this.form.get('fechaDevolucion')?.disable();
    } else {
      if (this.form.contains('estado')) {
        this.form.removeControl('estado');
      }
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
    if (this.form.contains('estado')) {
      this.form.removeControl('estado');
    }
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null;
    }
    this.prestamoSelected = null;
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.crearPrestamoModal('E');
    this.prestamoSelected = prestamo;
    this.modoEdicion = true;

    this.form.patchValue({
      idUsuario: prestamo.idUsuario,
      idLibro: prestamo.idLibro,
      fechaPrestamo: this.datePipe.transform(prestamo.fechaPrestamo, 'yyyy-MM-dd'),
      fechaDevolucion: this.datePipe.transform(prestamo.fechaDevolucion, 'yyyy-MM-dd'),
      estado: prestamo.estado,
      fechaEntrega: this.datePipe.transform(prestamo.fechaEntrega, 'yyyy-MM-dd')
    });
  }

  guardarActualizarPrestamo() {
    if (this.form.valid) {
      const rawValue = this.form.getRawValue();
      const fechaHoy = new Date().toISOString().split('T')[0];

      if (rawValue.fechaEntrega && rawValue.fechaEntrega < rawValue.fechaPrestamo) {
        this.showMessage('Advertencia', 'La fecha de entrega no puede ser anterior a la fecha de préstamo.', 'warning');
        return;
      }

      if (this.modoFormulario.includes('C')) {
        const nuevoPrestamo = {
          idUsuario: rawValue.idUsuario,
          idLibro: rawValue.idLibro,
          fechaPrestamo: new Date().toISOString().split('T')[0], // Fecha actual
          fechaDevolucion: rawValue.fechaDevolucion
        };
        
        this.prestamoService.guardarPrestamo(nuevoPrestamo).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaPrestamos();
            this.cerrarModal();
          },
          error: (error) => this.showMessage('Error', error.error.message, 'error')
        });
      } else {
        const updatedPrestamo = {
          ...this.prestamoSelected,
          estado: rawValue.estado,
          fechaEntrega: rawValue.fechaEntrega
        };
        this.prestamoService.actualizarPrestamo(updatedPrestamo).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaPrestamos();
            this.cerrarModal();
          },
          error: (error) => this.showMessage('Error', error.error.message, 'error')
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
