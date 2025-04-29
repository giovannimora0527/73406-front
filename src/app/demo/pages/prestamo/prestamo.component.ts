/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoService } from './service/prestamo.service';
import { Prestamo } from 'src/app/models/prestamo';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';

declare const bootstrap: any;

@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './prestamo.component.html',
  styleUrl: './prestamo.component.scss',
  providers: [DatePipe]
})
export class PrestamoComponent {
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  libros: Libro[] = [];

  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = 'Cargando';

  prestamoSelected: Prestamo;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    idUsuario: new FormControl(''),
    idLibro: new FormControl(''),
    fechaPrestamo: new FormControl(''),
    fechaDevolucion: new FormControl(''),
    estado: new FormControl(''),
    fechaEntrega: new FormControl('')
  });

  constructor(
    private prestamoService: PrestamoService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) {
    this.cargarUsuarios(); // Cargar usuarios y libros primero
    this.cargarLibros();
    this.cargarListaPrestamos(); // Luego préstamos
    this.cargarFormulario();
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      idUsuario: [null, [Validators.required]],
      idLibro: [null, [Validators.required]],
      fechaPrestamo: ['', [Validators.required]],
      fechaDevolucion: ['', [Validators.required]],
      estado: ['', [Validators.required]],
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
        // ENRIQUECER DATOS: Agregar nombre de usuario y título de libro
        this.prestamos.forEach((prestamo) => {
          const usuarioEncontrado = this.usuarios.find(u => u.idUsuario === prestamo.idUsuario);
          const libroEncontrado = this.libros.find(l => l.idLibro === prestamo.idLibro);
          prestamo['usuarioNombre'] = usuarioEncontrado ? usuarioEncontrado.nombre : 'N/A';
          prestamo['libroTitulo'] = libroEncontrado ? libroEncontrado.titulo : 'N/A';
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
      next: (data) => {
        this.usuarios = data;
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  cargarLibros() {
    this.prestamoService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Prestamo' : 'Editar Prestamo';

    if (modoForm === 'C') {
      this.form.reset();
      this.form.markAsPristine();
      this.form.markAsUntouched();
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
    this.form.reset({
      nombre: '',
      idUsuario: '',
      idLibro: '',
      fechaPrestamo: '',
      fechaDevolucion: '',
      estado: '',
      fechaEntrega: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.prestamoSelected = null;
  }

  abrirModoEdicion(prestamo: Prestamo) {
    this.crearPrestamoModal('E');
    this.prestamoSelected = prestamo;
    this.form.patchValue({
      nombre: this.prestamoSelected.nombre,
      idUsuario: this.prestamoSelected.idUsuario,
      idLibro: this.prestamoSelected.idLibro,
      fechaPrestamo: this.datePipe.transform(this.prestamoSelected.fechaPrestamo, 'yyyy-MM-dd'),
      fechaDevolucion: this.datePipe.transform(this.prestamoSelected.fechaDevolucion, 'yyyy-MM-dd'),
      estado: this.prestamoSelected.estado,
      fechaEntrega: this.datePipe.transform(this.prestamoSelected.fechaEntrega, 'yyyy-MM-dd')
    });
  }

  guardarActualizarPrestamo() {
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        const formValue = this.form.getRawValue();
        formValue.fechaPrestamo = this.datePipe.transform(formValue.fechaPrestamo, 'yyyy-MM-dd');
        formValue.fechaDevolucion = this.datePipe.transform(formValue.fechaDevolucion, 'yyyy-MM-dd');
        formValue.fechaEntrega = this.datePipe.transform(formValue.fechaEntrega, 'yyyy-MM-dd');

        this.prestamoService.guardarPrestamo(formValue).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaPrestamos();
            this.cerrarModal();
          },
          error: (error) => {
            this.showMessage('Error', error.error.message, 'error');
          }
        });
      } else {
        const usuario = this.prestamoSelected.idUsuario;
        const libro = this.prestamoSelected.idLibro;
        this.prestamoSelected = {
          ...this.prestamoSelected,
          ...this.form.getRawValue()
        };
        this.prestamoSelected.idUsuario = usuario;
        this.prestamoSelected.idLibro = libro;

        this.prestamoService.actualizarPrestamo(this.prestamoSelected).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaPrestamos();
            this.cerrarModal();
          },
          error: (error) => {
            this.showMessage('Error', error.error.message, 'error');
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
