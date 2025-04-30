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
  styleUrls: ['./prestamo.component.scss'],
  providers: [DatePipe]
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

  form: FormGroup = new FormGroup({
    idUsuario: new FormControl('', [Validators.required]),
    idLibro: new FormControl('', [Validators.required]),
    fechaPrestamo: new FormControl('', [Validators.required]),
    fechaDevolucion: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
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
      idUsuario: ['', [Validators.required]],
      idLibro: ['', [Validators.required]],
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
    } else if (modoForm === 'E') {
      this.form.get('idUsuario')?.disable();
      this.form.get('idLibro')?.disable();
      this.form.get('fechaPrestamo')?.disable();
      this.form.get('fechaDevolucion')?.disable();
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
    // Reiniciar el formulario
    this.form.reset({
      idUsuario: '',
      idLibro: '',
      fechaPrestamo: '',
      fechaDevolucion: '',
      estado: '',
      fechaEntrega: ''
    });
  
    // Restablecer el estado de los controles
    this.form.markAsPristine();
    this.form.markAsUntouched();
  
    // Si se ha inicializado una instancia del modal, la cerramos
    if (this.modalInstance) {
      this.modalInstance.hide();
      this.modalInstance = null; // Limpiar la referencia
    }
  
    // Restablecer el préstamo seleccionado
    this.prestamoSelected = null;
  }
  

  abrirModoEdicion(prestamo: Prestamo) {
    this.crearPrestamoModal('E');
    this.prestamoSelected = prestamo;
    this.modoEdicion = true;
  
    // Asignamos valores a los campos del formulario
    this.form.patchValue({
      idUsuario: prestamo.idUsuario,
      idLibro: prestamo.idLibro,
      fechaPrestamo: this.datePipe.transform(prestamo.fechaPrestamo, 'yyyy-MM-dd'),
      fechaDevolucion: this.datePipe.transform(prestamo.fechaDevolucion, 'yyyy-MM-dd'),
      estado: prestamo.estado,
      fechaEntrega: this.datePipe.transform(prestamo.fechaEntrega, 'yyyy-MM-dd')
    });
  
    // Opcionalmente mostrar datos adicionales si tienes campos visibles para eso
    const usuarioEncontrado = this.usuarios.find(u => u.idUsuario === prestamo.idUsuario);
    const libroEncontrado = this.libros.find(l => l.idLibro === prestamo.idLibro);
    this.form.get('nombre')?.setValue(usuarioEncontrado?.nombre || '');
    this.form.get('tituloLibro')?.setValue(libroEncontrado?.titulo || '');
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
        const formValue = this.form.getRawValue();
        // Solo actualizamos estado y fechaEntrega
        const updatedPrestamo = {
          ...this.prestamoSelected,
          estado: formValue.estado,
          fechaEntrega: formValue.fechaEntrega
        };

        this.prestamoService.actualizarPrestamo(updatedPrestamo).subscribe({
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
