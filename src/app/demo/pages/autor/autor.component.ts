/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidatorFn } from '@angular/forms';
import { DatePipe } from '@angular/common';

declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Nacionalidad } from 'src/app/models/nacionalidad';

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss',
  providers: [DatePipe]
})
export class AutorComponent implements OnInit {
  autores: Autor[] = [];
  nacionalidad: Nacionalidad[] = [];
  nacionalidadesValidas: Set<number> = new Set();
  modalInstance: any;
  csvModalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = 'Cargando';
  
  // Variables para carga CSV
  archivoSeleccionado: File = null;
  resultadoCarga: any = null;
  pasoActualCsv: number = 1;
  erroresValidacion: string[] = [];
  procesandoCsv: boolean = false;
  contenidoArchivo: string = '';
  autorSelected: Autor;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    nacionalidadId: new FormControl(''),
    fechaNacimiento: new FormControl('')
  });

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService
  ) {
    this.cargarFormulario();
  }

  ngOnInit(): void {
    // Inicializar los modales una vez que el DOM esté listo
    this.cargarListaAutores();
    this.cargarNacionalidades();
    
    // Escuchar el evento hidden.bs.modal para restablecer el modal cuando se cierra con la X
    document.addEventListener('hidden.bs.modal', (event: any) => {
      if (event.target.id === 'cargarCsvModal') {
        this.resetearProcesoCarga();
      }
    });
  }

  // VALIDADOR PERSONALIZADO: Solo letras, espacios y algunos caracteres especiales
  validadorNombreAutor(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Si está vacío, lo maneja el validador required
      }

      const nombre = control.value.trim();

      // Verificar longitud
      if (nombre.length < 2) {
        return { nombreInvalido: { message: 'El nombre debe tener al menos 2 caracteres' } };
      }

      if (nombre.length > 100) {
        return { nombreInvalido: { message: 'El nombre no puede tener más de 100 caracteres' } };
      }

      // Regex que permite letras (incluye acentos), espacios, puntos, guiones y apostrofes
      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.\-']+$/;
      
      if (!regex.test(nombre)) {
        return { 
          nombreInvalido: { 
            message: 'El nombre solo puede contener letras, espacios, puntos, guiones y apostrofes. No se permiten números ni otros caracteres especiales.' 
          } 
        };
      }

      // Verificar que no empiece o termine con espacios, puntos o guiones
      if (nombre.startsWith(' ') || nombre.endsWith(' ') || 
          nombre.startsWith('.') || nombre.endsWith('.') ||
          nombre.startsWith('-') || nombre.endsWith('-')) {
        return { nombreInvalido: { message: 'El nombre no puede empezar o terminar con espacios, puntos o guiones' } };
      }

      // Verificar espacios dobles
      if (nombre.includes('  ')) {
        return { nombreInvalido: { message: 'El nombre no puede contener espacios dobles consecutivos' } };
      }

      // Verificar que no sea solo espacios o caracteres especiales
      if (nombre.replace(/[\s.\-']/g, '').length === 0) {
        return { nombreInvalido: { message: 'El nombre debe contener al menos una letra' } };
      }

      return null;
    };
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, this.validadorNombreAutor()]],
      nacionalidadId: [null, [Validators.required]],
      fechaNacimiento: ['', [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  // MÉTODO AUXILIAR: Validar nombre de autor (para usar en validaciones CSV)
  private validarNombreAutor(nombre: string): { valido: boolean; mensaje?: string } {
    if (!nombre || nombre.trim().length === 0) {
      return { valido: false, mensaje: 'El nombre es obligatorio' };
    }

    const nombreLimpio = nombre.trim();

    // Verificar longitud
    if (nombreLimpio.length < 2) {
      return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
    }

    if (nombreLimpio.length > 100) {
      return { valido: false, mensaje: 'El nombre no puede tener más de 100 caracteres' };
    }

    // Regex que permite letras (incluye acentos), espacios, puntos, guiones y apostrofes
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.\-']+$/;
    
    if (!regex.test(nombreLimpio)) {
      return { 
        valido: false, 
        mensaje: 'El nombre solo puede contener letras, espacios, puntos. No se permiten números ni otros caracteres especiales.' 
      };
    }

    // Verificar que no empiece o termine con espacios, puntos o guiones
    if (nombreLimpio.startsWith(' ') || nombreLimpio.endsWith(' ') || 
        nombreLimpio.startsWith('.') || nombreLimpio.endsWith('.') ||
        nombreLimpio.startsWith('-') || nombreLimpio.endsWith('-')) {
      return { valido: false, mensaje: 'El nombre no puede empezar o terminar con espacios, puntos o guiones' };
    }

    // Verificar espacios dobles
    if (nombreLimpio.includes('  ')) {
      return { valido: false, mensaje: 'El nombre no puede contener espacios dobles consecutivos' };
    }

    // Verificar que no sea solo espacios o caracteres especiales
    if (nombreLimpio.replace(/[\s.\-']/g, '').length === 0) {
      return { valido: false, mensaje: 'El nombre debe contener al menos una letra' };
    }

    return { valido: true };
  }

  cargarListaAutores() {
    this.spinner.show();
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        this.spinner.hide();
      },
      error: (error) => {
        this.showMessage('Error', error.error?.message || 'Error al cargar autores', 'error');
        this.spinner.hide();
      }
    });
  }

  cargarNacionalidades() {
    this.autorService.getNacionalidades().subscribe({
      next: (data) => {
        this.nacionalidad = data;
        // Actualizar el conjunto de nacionalidades válidas
        this.nacionalidadesValidas = new Set(data.map(n => n.nacionalidadId));
      },
      error: (error) => {
        this.showMessage('Error', error.error?.message || 'Error al cargar nacionalidades', 'error');
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Autor' : 'Editar Autor';

    if (modoForm === 'C') {
      this.form.reset(); // limpia todo
      this.form.markAsPristine(); // marca como limpio
      this.form.markAsUntouched(); // marca como no tocado
    }

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
      nacionalidadId: this.autorSelected.nacionalidad.nacionalidadId,
      fechaNacimiento: this.datePipe.transform(this.autorSelected.fechaNacimiento, 'yyyy-MM-dd')
    });
  }

  guardarActualizarAutor() {
    if (this.form.valid) {
      if (this.modoFormulario.includes('C')) {
        // Transformar fecha
        const formValue = this.form.getRawValue();
        formValue.fechaNacimiento = this.datePipe.transform(formValue.fechaNacimiento, 'yyyy-MM-dd');
        
        this.autorService.guardarAutor(this.form.getRawValue()).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaAutores();
            this.cerrarModal();
          },
          error: (error) => {
            this.showMessage('Error', error.error?.message || 'Error al guardar autor', 'error');
          }
        });
      } else {
        const nacionalidad = this.autorSelected.nacionalidad;
        this.autorSelected = {
          ...this.autorSelected,
          ...this.form.getRawValue()
        };
       
        this.autorSelected.nacionalidad = nacionalidad;
        this.autorService.actualizarAutor(this.autorSelected).subscribe({
          next: (data) => {
            this.showMessage('Éxito', data.message, 'success');
            this.cargarListaAutores();
            this.cerrarModal();
          },
          error: (error) => {
            this.showMessage('Error', error.error?.message || 'Error al actualizar autor', 'error');
          }
        });
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key).markAsTouched();
      });
    }
  }

  showMessage(title: string, text: string, icon: SweetAlertIcon) {
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
  
  // Método para manejar la selección del archivo
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.archivoSeleccionado = event.target.files[0];
      this.erroresValidacion = [];
      this.leerContenidoArchivo();
    } else {
      this.archivoSeleccionado = null;
      this.contenidoArchivo = '';
    }
  }

  // Lee el contenido del archivo para validaciones
  leerContenidoArchivo(): void {
    if (!this.archivoSeleccionado) {
      this.contenidoArchivo = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      this.contenidoArchivo = e.target?.result as string || '';
    };
    reader.readAsText(this.archivoSeleccionado);
  }

  // Validar archivo CSV antes de enviar al servidor
  validarCSV(): void {
    this.erroresValidacion = [];
    
    if (!this.archivoSeleccionado) {
      this.erroresValidacion.push('No se ha seleccionado ningún archivo.');
      this.pasoActualCsv = 2;
      return;
    }
    
    if (!this.archivoSeleccionado.name.toLowerCase().endsWith('.csv')) {
      this.erroresValidacion.push('El archivo debe tener extensión .csv');
    }
    
    if (!this.contenidoArchivo) {
      this.leerContenidoArchivo();
      setTimeout(() => this.validarContenidoCSV(), 500);
      return;
    }
    
    this.validarContenidoCSV();
  }
  
  validarContenidoCSV(): void {
    if (!this.contenidoArchivo) {
      this.erroresValidacion.push('El archivo está vacío.');
      this.pasoActualCsv = 2;
      return;
    }
    
    const lineas = this.contenidoArchivo.split('\n')
      .map(linea => linea.trim())
      .filter(linea => linea.length > 0);
    
    if (lineas.length === 0) {
      this.erroresValidacion.push('El archivo no contiene datos.');
      this.pasoActualCsv = 2;
      return;
    }
    
    // Verificamos si tiene encabezado y lo saltamos si es necesario
    let inicioLineas = 0;
    if (lineas[0].toLowerCase().includes('nombre') || 
        lineas[0].toLowerCase().includes('nacionalidad') || 
        lineas[0].toLowerCase().includes('fecha')) {
      inicioLineas = 1;
    }
    
    // Validamos todas las líneas para una verificación completa
    const lineasAValidar = lineas.slice(inicioLineas);
    
    // Recopilamos los nombres para verificar duplicados en el mismo archivo
    const nombresEnArchivo = new Set<string>();
    const nombresExistentes = this.autores.map(autor => autor.nombre.toLowerCase());
    
    for (let i = 0; i < lineasAValidar.length; i++) {
      const numeroLinea = inicioLineas + i + 1;
      const linea = lineasAValidar[i];
      
      // Validar campos requeridos
      const campos = linea.split(',');
      
      if (campos.length < 3) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: Faltan campos. Se requieren 3 campos (nombre, nacionalidadId, fechaNacimiento).`);
        continue;
      }
      
      const nombre = campos[0].trim().replace(/"/g, "");
      const nacionalidadId = campos[1].trim().replace(/"/g, "");
      const fechaNacimiento = campos[2].trim().replace(/"/g, "");
      
      if (!nombre) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El campo nombre es obligatorio.`);
      } else {
        //Verificar que el nombre solo contenga letras y espacios
        const validacionNombre = this.validarNombreAutor(nombre);
        if (!validacionNombre.valido) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: ${validacionNombre.mensaje}`);
        } else {
          // Verificar duplicados en el mismo archivo
          const nombreLower = nombre.toLowerCase();
          if (nombresEnArchivo.has(nombreLower)) {
            this.erroresValidacion.push(`Línea ${numeroLinea}: El autor "${nombre}" está duplicado en el archivo.`);
          } else {
            nombresEnArchivo.add(nombreLower);
          }
          
          // Verificar si el autor ya existe en la base de datos
          if (nombresExistentes.includes(nombreLower)) {
            this.erroresValidacion.push(`Línea ${numeroLinea}: El autor "${nombre}" ya existe en la base de datos.`);
          }
        }
      }
      
      if (!nacionalidadId) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El campo nacionalidadId es obligatorio.`);
      } else if (!/^\d+$/.test(nacionalidadId)) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El ID de nacionalidad debe ser un número.`);
      } else {
        // Verificar si el ID de nacionalidad existe
        const nacionalidadIdNum = parseInt(nacionalidadId, 10);
        if (!this.nacionalidadesValidas.has(nacionalidadIdNum)) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: La nacionalidad con ID ${nacionalidadId} no existe en el sistema.`);
        }
      }
      
      if (!fechaNacimiento) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El campo fechaNacimiento es obligatorio.`);
      } else {
        // Validar formato de fecha
        const regexIso = /^\d{4}-\d{2}-\d{2}$/;
        const regexDMY1 = /^\d{2}\/\d{2}\/\d{4}$/;
        const regexDMY2 = /^\d{2}-\d{2}-\d{4}$/;
        
        if (!regexIso.test(fechaNacimiento) && 
            !regexDMY1.test(fechaNacimiento) && 
            !regexDMY2.test(fechaNacimiento)) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: Formato de fecha inválido. Use YYYY-MM-DD, DD/MM/YYYY o DD-MM-YYYY.`);
        }
      }
    }
    
    // Avanzar al paso 2 de validación
    this.pasoActualCsv = 2;
  }

  // Método para cargar el archivo CSV
  cargarCSV(): void {
    if (!this.archivoSeleccionado || this.erroresValidacion.length > 0) {
      return;
    }
    
    this.pasoActualCsv = 3;
    this.procesandoCsv = true;
    
    this.autorService.cargarAutoresCSV(this.archivoSeleccionado).subscribe({
      next: (respuesta) => {
        this.procesandoCsv = false;
        this.resultadoCarga = respuesta;
        
        // Actualizar la lista de autores si hubo éxitos
        if (respuesta.exitosos > 0) {
          this.cargarListaAutores();
        }
      },
      error: (error) => {
        this.procesandoCsv = false;
        console.error('Error al cargar CSV:', error);
        
        this.resultadoCarga = {
          totalProcesados: 0,
          exitosos: 0,
          fallidos: 1,
          errores: [
            error.error && error.error.message 
              ? error.error.message 
              : 'Se produjo un error al procesar el archivo CSV.'
          ]
        };
      }
    });
  }
  
  // Método para reiniciar el proceso de carga
  resetearProcesoCarga(): void {
    this.pasoActualCsv = 1;
    this.archivoSeleccionado = null;
    this.resultadoCarga = null;
    this.erroresValidacion = [];
    this.contenidoArchivo = '';
    
    // Limpiar el campo de archivo
    const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}