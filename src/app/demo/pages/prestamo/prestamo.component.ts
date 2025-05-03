/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
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
export class PrestamoComponent implements OnInit {
  modoEdicion: boolean = false;
  prestamos: Prestamo[] = [];
  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  librosDisponibles: Libro[] = [];

  modalCreacionInstance: any;
  modalEdicionInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = 'Cargando';

  prestamoSelected: Prestamo;

  // Formulario principal (para creación)
  form: FormGroup;

  // Formulario simplificado para edición (solo fecha de entrega)
  formEdicion: FormGroup;

  /**
   * Constructor del componente
   * @param prestamoService Servicio para gestionar préstamos
   * @param formBuilder Constructor de formularios reactivos
   * @param datePipe Pipe para formatear fechas
   * @param spinner Servicio para mostrar spinner de carga
   */
  constructor(
    private prestamoService: PrestamoService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) { }

  /**
   * Método que se ejecuta al inicializar el componente
   */
  ngOnInit(): void {
    this.cargarUsuarios(); 
    this.cargarLibrosDisponibles();  
    this.cargarListaPrestamos(); 
    this.inicializarFormularios();
  }

  /**
   * Inicializa los formularios con validaciones
   */
  inicializarFormularios() {
    // Formulario de creación
    this.form = this.formBuilder.group({
      idUsuario: ['', [Validators.required]],
      idLibro: ['', [Validators.required]],
      fechaPrestamo: [this.obtenerFechaActual(), [Validators.required]],
      fechaDevolucion: ['', [Validators.required, this.validarFechaDevolucion.bind(this)]]
    });

    // Formulario simplificado para edición (solo fecha entrega)
    this.formEdicion = this.formBuilder.group({
      fechaEntrega: ['', [Validators.required]]
    });
  }

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD
   * @returns Fecha actual formateada
   */
  obtenerFechaActual(): string {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

  /**
   * Obtiene los controles del formulario para facilitar la validación
   */
  get f(): { [key: string]: AbstractControl } {
    return this.modoFormulario === 'C' ? this.form.controls : this.formEdicion.controls;
  }

  /**
   * Validador personalizado para fecha de devolución
   * La fecha debe ser al menos un día posterior a la fecha actual
   */
  validarFechaDevolucion(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) return null;
    
    const fechaDevolucion = new Date(control.value);
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
    
    // Fecha mínima: un día después de la fecha actual
    const fechaMinima = new Date(fechaActual);
    fechaMinima.setDate(fechaMinima.getDate() + 1);
    
    if (fechaDevolucion < fechaMinima) {
      return { 'fechaInvalida': true };
    }
    
    return null;
  }

  /**
   * Carga la lista de préstamos desde el servicio
   */
  cargarListaPrestamos() {
    this.spinner.show();
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => {
        this.prestamos = data;
        this.spinner.hide();
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
        this.spinner.hide();
      }
    });
  }

  /**
   * Carga la lista de usuarios desde el servicio
   */
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

  /**
   * Carga la lista de libros disponibles desde el servicio
   */
  cargarLibrosDisponibles() {
    this.prestamoService.getLibrosDisponibles().subscribe({
      next: (data) => {
        this.librosDisponibles = data;
      },
      error: (error) => {
        this.showMessage('Error', error.error.message, 'error');
      }
    });
  }

  /**
   * Inicializa el modal para crear un préstamo
   */
  crearPrestamoModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.modoEdicion = modoForm === 'E';
    this.titleModal = modoForm === 'C' ? 'Crear Préstamo' : 'Editar Préstamo';

    // Resetear formularios
    this.form.reset();
    this.formEdicion.reset();
    
    // Si es creación, establecer fecha actual
    if (modoForm === 'C') {
      this.form.get('fechaPrestamo').setValue(this.obtenerFechaActual());
      
      // Mostrar modal de creación
      const modalElement = document.getElementById('crearPrestamoModal');
      if (modalElement) {
        if (!this.modalCreacionInstance) {
          this.modalCreacionInstance = new bootstrap.Modal(modalElement);
        }
        this.modalCreacionInstance.show();
      }
    } else if (modoForm === 'E') {
      // Mostrar modal de edición
      const modalElement = document.getElementById('editarPrestamoModal');
      if (modalElement) {
        if (!this.modalEdicionInstance) {
          this.modalEdicionInstance = new bootstrap.Modal(modalElement);
        }
        this.modalEdicionInstance.show();
      }
    }
  }

  /**
   * Cierra los modales y limpia los formularios
   */
  cerrarModal() {
    // Cerrar el modal de creación si está abierto
    if (this.modalCreacionInstance) {
      this.modalCreacionInstance.hide();
    }
    
    // Cerrar el modal de edición si está abierto
    if (this.modalEdicionInstance) {
      this.modalEdicionInstance.hide();
    }
    
    // Resetear formularios
    this.form.reset();
    this.formEdicion.reset();
    
    // Limpiar préstamo seleccionado y modo de edición
    this.prestamoSelected = null;
    this.modoEdicion = false;
    this.modoFormulario = '';
  }
  
  /**
   * Abre el modal en modo edición con los datos del préstamo seleccionado
   * Solo muestra el campo de fecha de entrega según los requisitos
   */
  abrirModoEdicion(prestamo: Prestamo) {
    this.prestamoSelected = prestamo;
    this.crearPrestamoModal('E');
    
    // Si hay una fecha de entrega existente, establecerla en el formulario
    if (prestamo.fechaEntrega) {
      this.formEdicion.get('fechaEntrega').setValue(
        this.datePipe.transform(prestamo.fechaEntrega, 'yyyy-MM-dd')
      );
    }
  }
  
  /**
   * Guarda o actualiza un préstamo según el modo del formulario
   */
  guardarActualizarPrestamo() {
    if (this.modoFormulario === 'C' && this.form.valid) {
      // Crear nuevo préstamo
      const nuevoPrestamo = {
        idUsuario: this.form.get('idUsuario').value,
        idLibro: this.form.get('idLibro').value,
        fechaPrestamo: this.form.get('fechaPrestamo').value,
        fechaDevolucion: this.form.get('fechaDevolucion').value
      };
      
      this.spinner.show();
      this.prestamoService.guardarPrestamo(nuevoPrestamo).subscribe({
        next: (data) => {
          this.showMessage('Éxito', 'Préstamo creado correctamente', 'success');
          this.cargarListaPrestamos();
          this.cargarLibrosDisponibles(); // Actualizar lista de libros disponibles
          this.cerrarModal();
          this.spinner.hide();
        },
        error: (error) => {
          this.showMessage('Error', error.error.message || 'Error al crear el préstamo', 'error');
          this.spinner.hide();
        }
      });
    } else if (this.modoFormulario === 'E' && this.formEdicion.valid && this.prestamoSelected) {
      // Actualizar préstamo (solo fecha de entrega)
      const fechaEntrega = this.formEdicion.get('fechaEntrega').value;
      
      const prestamoActualizado = {
        idPrestamo: this.prestamoSelected.idPrestamo,
        fechaEntrega: fechaEntrega
      };
      
      this.spinner.show();
      this.prestamoService.actualizarPrestamo(this.prestamoSelected.idPrestamo, prestamoActualizado).subscribe({
        next: (data) => {
          this.showMessage('Éxito', 'Préstamo actualizado correctamente', 'success');
          this.cargarListaPrestamos();
          this.cargarLibrosDisponibles(); // Actualizar lista de libros disponibles
          this.cerrarModal();
          this.spinner.hide();
        },
        error: (error) => {
          this.showMessage('Error', error.error.message || 'Error al actualizar el préstamo', 'error');
          this.spinner.hide();
        }
      });
    } else {
      // Marcar campos como tocados para mostrar errores
      if (this.modoFormulario === 'C') {
        Object.keys(this.form.controls).forEach(key => {
          this.form.get(key).markAsTouched();
        });
      } else {
        Object.keys(this.formEdicion.controls).forEach(key => {
          this.formEdicion.get(key).markAsTouched();
        });
      }
      
      this.showMessage('Error', 'Por favor, complete todos los campos requeridos correctamente', 'error');
    }
  }

  /**
   * Muestra mensajes al usuario usando SweetAlert2
   */
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