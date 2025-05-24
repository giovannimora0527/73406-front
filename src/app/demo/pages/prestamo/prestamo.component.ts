/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
export class PrestamoComponent implements OnInit, OnDestroy {
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
   * @param cdr ChangeDetectorRef para forzar detección de cambios
   */
  constructor(
    private prestamoService: PrestamoService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private cdr: ChangeDetectorRef
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
   * Método que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    // Limpiar modales si existen
    if (this.modalCreacionInstance) {
      try {
        this.modalCreacionInstance.dispose();
      } catch (e) {
        console.warn('Error al limpiar modal de creación en ngOnDestroy:', e);
      }
      this.modalCreacionInstance = null;
    }
    
    if (this.modalEdicionInstance) {
      try {
        this.modalEdicionInstance.dispose();
      } catch (e) {
        console.warn('Error al limpiar modal de edición en ngOnDestroy:', e);
      }
      this.modalEdicionInstance = null;
    }

    //Restaurar scroll del body
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');
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
        this.showMessage('Error', error.error?.message || 'Error al cargar préstamos', 'error');
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
        this.showMessage('Error', error.error?.message || 'Error al cargar usuarios', 'error');
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
        this.showMessage('Error', error.error?.message || 'Error al cargar libros', 'error');
      }
    });
  }

  /**
   * Inicializa el modal para crear un préstamo
   */
  crearPrestamoModal(modoForm: string) {
    // PREVENIR CLICS MÚLTIPLES: Deshabilitar temporalmente
    const button = event?.target as HTMLElement;
    if (button) {
      button.style.pointerEvents = 'none';
      setTimeout(() => {
        button.style.pointerEvents = 'auto';
      }, 1000);
    }

    
    this.modoFormulario = modoForm;
    this.modoEdicion = modoForm === 'E';
    this.titleModal = modoForm === 'C' ? 'Crear Préstamo' : 'Editar Préstamo';

    // Forzar detección de cambios
    this.cdr.detectChanges();

    if (modoForm === 'C') {
      // Preparar formulario de creación
      this.form.reset();
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.form.get('fechaPrestamo')?.setValue(this.obtenerFechaActual());
      
      // Usar setTimeout para asegurar que Angular detecte el cambio
      setTimeout(() => {
        const modalElement = document.getElementById('crearPrestamoModal');
        if (modalElement && this.modoFormulario === 'C') { // Verificar que el modo siga siendo correcto
          // Limpiar instancia anterior
          if (this.modalCreacionInstance) {
            try {
              this.modalCreacionInstance.dispose();
            } catch (e) {
              console.warn('Error al dispose del modal:', e);
            }
            this.modalCreacionInstance = null;
          }
          
          // Crear nueva instancia y mostrar
          this.modalCreacionInstance = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          this.modalCreacionInstance.show();
        }
      }, 100); // Aumenté el delay a 100ms
      
    } else if (modoForm === 'E') {
      // Preparar formulario de edición
      this.formEdicion.reset();
      this.formEdicion.markAsPristine();
      this.formEdicion.markAsUntouched();
      
      // Usar setTimeout para modal de edición también
      setTimeout(() => {
        const modalElement = document.getElementById('editarPrestamoModal');
        if (modalElement && this.modoFormulario === 'E') { // Verificar que el modo siga siendo correcto
          // Limpiar instancia anterior
          if (this.modalEdicionInstance) {
            try {
              this.modalEdicionInstance.dispose();
            } catch (e) {
              console.warn('Error al dispose del modal:', e);
            }
            this.modalEdicionInstance = null;
          }
          
          // Crear nueva instancia y mostrar
          this.modalEdicionInstance = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
          });
          this.modalEdicionInstance.show();
        }
      }, 100);
    }
  }

  /**
   * Cierra los modales y limpia los formularios
   */
  cerrarModal() {
    // Limpiar el modo INMEDIATAMENTE
    this.modoFormulario = '';
    this.modoEdicion = false;
    this.prestamoSelected = null;

    // Restaurar scroll antes de cerrar modales
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open');

    // Cerrar modales de forma más robusta
    if (this.modalCreacionInstance) {
      try {
        this.modalCreacionInstance.hide();
        // Limpiar inmediatamente después de ocultar
        setTimeout(() => {
          if (this.modalCreacionInstance) {
            this.modalCreacionInstance.dispose();
            this.modalCreacionInstance = null;
          }
        
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          document.body.classList.remove('modal-open');
        }, 150);
      } catch (e) {
        console.warn('Error al cerrar modal de creación:', e);
        this.modalCreacionInstance = null;
        // Restaurar scroll en caso de error
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('modal-open');
      }
    }
    
    if (this.modalEdicionInstance) {
      try {
        this.modalEdicionInstance.hide();
        // Limpiar inmediatamente después de ocultar
        setTimeout(() => {
          if (this.modalEdicionInstance) {
            this.modalEdicionInstance.dispose();
            this.modalEdicionInstance = null;
          }
          
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
          document.body.classList.remove('modal-open');
        }, 150);
      } catch (e) {
        console.warn('Error al cerrar modal de edición:', e);
        this.modalEdicionInstance = null;
        // Restaurar scroll en caso de error
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.classList.remove('modal-open');
      }
    }
    
    // Reset de formularios mejorado
    if (this.form) {
      this.form.reset();
      this.form.markAsPristine();
      this.form.markAsUntouched();
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.setErrors(null);
      });
    }
    
    if (this.formEdicion) {
      this.formEdicion.reset();
      this.formEdicion.markAsPristine();
      this.formEdicion.markAsUntouched();
      Object.keys(this.formEdicion.controls).forEach(key => {
        this.formEdicion.get(key)?.setErrors(null);
      });
    }

    // Asegurar scroll después de todo
    setTimeout(() => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      document.body.classList.remove('modal-open');
      // Verificar si quedan otros modales abiertos
      const openModals = document.querySelectorAll('.modal.show');
      if (openModals.length === 0) {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    }, 300);
  }
  
  /**
   * Abre el modal en modo edición con los datos del préstamo seleccionado
   * Solo muestra el campo de fecha de entrega según los requisitos
   */
  abrirModoEdicion(prestamo: Prestamo) {
    // Validar que el préstamo no esté ya devuelto
    if (prestamo.estado === 'DEVUELTO') {
      this.showMessage('Información', 'Este préstamo ya fue devuelto y no se puede modificar.', 'info');
      return;
    }

    this.prestamoSelected = prestamo;
    this.crearPrestamoModal('E');
    
    // Si hay una fecha de entrega existente, establecerla en el formulario
    if (prestamo.fechaEntrega) {
      this.formEdicion.get('fechaEntrega')?.setValue(
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
        idUsuario: parseInt(this.form.get('idUsuario')?.value),
        idLibro: parseInt(this.form.get('idLibro')?.value),
        fechaPrestamo: this.form.get('fechaPrestamo')?.value,
        fechaDevolucion: this.form.get('fechaDevolucion')?.value
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
          this.showMessage('Error', error.error?.message || 'Error al crear el préstamo', 'error');
          this.spinner.hide();
        }
      });
    } else if (this.modoFormulario === 'E' && this.formEdicion.valid && this.prestamoSelected) {
      // Actualizar préstamo (solo fecha de entrega)
      const fechaEntrega = this.formEdicion.get('fechaEntrega')?.value;
      
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
          this.showMessage('Error', error.error?.message || 'Error al actualizar el préstamo', 'error');
          this.spinner.hide();
        }
      });
    } else {
      // Marcar campos como tocados para mostrar errores
      if (this.modoFormulario === 'C') {
        Object.keys(this.form.controls).forEach(key => {
          this.form.get(key)?.markAsTouched();
        });
      } else {
        Object.keys(this.formEdicion.controls).forEach(key => {
          this.formEdicion.get(key)?.markAsTouched();
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