import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import Swal, { SweetAlertIcon } from 'sweetalert2';

// Modelos
import { Libro } from 'src/app/models/libro';
import { Autor } from 'src/app/models/autor';

// Servicios
import { LibroService } from './service/libro.service';
import { AutorService } from '../autor/service/autor.service';

declare const bootstrap: any;

@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './libro.component.html',
  styleUrl: './libro.component.scss'
})
export class LibroComponent implements OnInit {
  // Propiedades para la interfaz
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  
  // Propiedades de datos
  libroSelected: Libro;
  libros: Libro[] = [];
  autores: Autor[] = [];
  
  // Propiedades para la carga masiva CSV
  modalCargaMasivaInstance: any;
  archivoSeleccionado: File = null;
  resultadoCarga: any = null;
  pasoActualCsv: number = 1;
  erroresValidacion: string[] = [];
  procesandoCsv: boolean = false;
  contenidoArchivo: string = '';
  autoresValidos: Set<number> = new Set();
  
  // NUEVO: Mapa para obtener nombres de autores por ID
  autoresPorId: Map<number, string> = new Map();
  
  // Formulario reactivo
  form: FormGroup;

  constructor(
    private readonly libroService: LibroService,
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly autorService: AutorService
  ) {
    this.cargarFormulario();
  }

  ngOnInit(): void {
    this.getLibros();
    this.getAutores();
    
    // Escuchar el evento hidden.bs.modal para restablecer el modal cuando se cierra con la X
    document.addEventListener('hidden.bs.modal', (event: any) => {
      if (event.target.id === 'cargaMasivaModal') {
        this.resetearProcesoCarga();
      }
    });
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

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  getAutores() {
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        // Actualizar el conjunto de autores válidos para validación CSV
        this.autoresValidos = new Set(data.map(a => a.autorId || a.idAutor));
        
        // NUEVO: Crear mapa de ID -> Nombre para mostrar nombres en errores
        this.autoresPorId.clear();
        data.forEach(autor => {
          const id = autor.autorId || autor.idAutor;
          if (id) {
            this.autoresPorId.set(id, autor.nombre);
          }
        });
        
        console.log('Autores cargados:', data);
        console.log('IDs de autores válidos:', Array.from(this.autoresValidos));
        console.log('Mapa de autores por ID:', this.autoresPorId);
      },
      error: (error) => {
        console.error('Error al cargar autores:', error);
        this.showMessage('Error', 'No se pudieron cargar los autores', 'error');
      },
    });
  }

  getLibros() {
    this.spinner.show();
    this.msjSpinner = 'Cargando libros...';
    
    this.libroService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al cargar libros:', error);
        this.spinner.hide();
        this.showMessage('Error', 'No se pudieron cargar los libros', 'error');
      }
    });
  }

  crearModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm === 'C' ? 'Crear Libro' : 'Editar Libro';
    
    const modalElement = document.getElementById('crearModal');
    if (!modalElement) return;
    
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    
    if (!this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
    this.modalInstance.show();
  }

  abrirModoEdicion(libro: Libro) {
    this.crearModal('E');
    this.libroSelected = libro;
    
    this.form.patchValue({
      titulo: libro.titulo,
      autorId: libro.autor?.idAutor,
      anioPublicacion: libro.anioPublicacion,
      categoriaId: libro.categoria?.categoriaId,
      existencias: libro.existencias
    });
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    
    this.libroSelected = null;
  }

  guardarActualizar() {
    if (!this.form.valid) {
      this.showMessage('Error', 'Por favor complete todos los campos requeridos', 'error');
      return;
    }
    
    const libroData = this.form.getRawValue();
    
    this.spinner.show();
    this.msjSpinner = this.modoFormulario === 'C' ? 'Guardando libro...' : 'Actualizando libro...';
    
    if (this.modoFormulario === 'C') {
      console.log("Creando nuevo libro:", libroData);
      // TODO: Implementar llamada al servicio para guardar
    } else {
      console.log("Actualizando libro:", libroData);
      // TODO: Implementar llamada al servicio para actualizar
    }
    
    // Simular finalización (reemplazar con llamada real al servicio)
    setTimeout(() => {
      this.spinner.hide();
      this.cerrarModal();
      this.getLibros();
    }, 1000);
  }

  // ==================== MÉTODOS PARA CARGA MASIVA CSV ====================

  abrirModalCargaMasiva() {
    const modalElement = document.getElementById('cargaMasivaModal');
    if (!modalElement) return;
    
    if (!this.modalCargaMasivaInstance) {
      this.modalCargaMasivaInstance = new bootstrap.Modal(modalElement);
    }
    this.modalCargaMasivaInstance.show();
  }

  cerrarModalCargaMasiva() {
    if (this.modalCargaMasivaInstance) {
      this.modalCargaMasivaInstance.hide();
    }
    this.resetearProcesoCarga();
  }

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
    
    // Verificar si tiene encabezado y validarlo
    let inicioLineas = 0;
    const primeraLinea = lineas[0].toLowerCase();
    
    if (primeraLinea.includes('titulo') || primeraLinea.includes('autor') || primeraLinea.includes('año')) {
      // Validar que el encabezado tenga las columnas requeridas
      const columnasRequeridas = ['titulo', 'idautor', 'aniopublicacion', 'categoriaid', 'existencias'];
      const encabezadoCompleto = primeraLinea.replace(/\s/g, '').replace(/"/g, '');
      
      const columnasFaltantes = columnasRequeridas.filter(col => 
        !encabezadoCompleto.includes(col) && 
        !encabezadoCompleto.includes(col.replace('id', '_id')) &&
        !encabezadoCompleto.includes(col.replace('anio', 'año'))
      );
      
      if (columnasFaltantes.length > 0) {
        this.erroresValidacion.push(`Faltan las siguientes columnas en el encabezado: ${columnasFaltantes.join(', ')}`);
        this.erroresValidacion.push('Las columnas requeridas son: titulo, idAutor, anioPublicacion, categoriaId, existencias');
      }
      
      inicioLineas = 1;
    } else {
      this.erroresValidacion.push('Se recomienda incluir un encabezado con los nombres de las columnas.');
    }
    
    // Obtener año actual para validación
    const anioActual = new Date().getFullYear();
    
    // Validar todas las líneas de datos
    const lineasAValidar = lineas.slice(inicioLineas);
    
    // Recopilar títulos para verificar duplicados (ahora solo por título)
    const titulosEnArchivo = new Set<string>();
    const titulosExistentes = new Set(this.libros.map(libro => libro.titulo.toLowerCase()));
    
    for (let i = 0; i < lineasAValidar.length; i++) {
      const numeroLinea = inicioLineas + i + 1;
      const linea = lineasAValidar[i];
      
      const campos = linea.split(',');
      
      if (campos.length < 5) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: Faltan campos. Se requieren 5 campos (titulo, idAutor, anioPublicacion, categoriaId, existencias).`);
        continue;
      }
      
      const titulo = campos[0].trim().replace(/"/g, "");
      const idAutorStr = campos[1].trim().replace(/"/g, "");
      const anioPublicacionStr = campos[2].trim().replace(/"/g, "");
      const categoriaIdStr = campos[3].trim().replace(/"/g, "");
      const existenciasStr = campos[4].trim().replace(/"/g, "");
      
      // Validar título
      if (!titulo) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El campo título es obligatorio.`);
      } else {
        // ACTUALIZACIÓN: Verificar duplicados solo por título
        const tituloLower = titulo.toLowerCase();
        
        if (titulosEnArchivo.has(tituloLower)) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: El libro "${titulo}" está duplicado en el archivo.`);
        } else {
          titulosEnArchivo.add(tituloLower);
        }
        
        // Verificar duplicados en la base de datos (solo por título)
        if (titulosExistentes.has(tituloLower)) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: El libro "${titulo}" ya existe en la base de datos.`);
        }
      }
      
      // Validar ID del autor
      if (!idAutorStr) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El campo idAutor es obligatorio.`);
      } else if (!/^\d+$/.test(idAutorStr)) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El ID del autor debe ser un número.`);
      } else {
        const idAutor = parseInt(idAutorStr, 10);
        console.log(`Validando autor ID ${idAutor} en línea ${numeroLinea}`);
        console.log('Autores válidos disponibles:', Array.from(this.autoresValidos));
        
        if (!this.autoresValidos.has(idAutor)) {
          // MEJORA: Mostrar nombre del autor si existe, si no, mostrar ID
          const nombreAutor = this.autoresPorId.get(idAutor);
          if (nombreAutor) {
            this.erroresValidacion.push(`Línea ${numeroLinea}: El autor "${nombreAutor}" (ID: ${idAutor}) no existe en el sistema.`);
          } else {
            this.erroresValidacion.push(`Línea ${numeroLinea}: El autor con ID ${idAutor} no existe en el sistema.`);
          }
        }
      }
      
      // Validar año de publicación
      if (!anioPublicacionStr) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El campo anioPublicacion es obligatorio.`);
      } else if (!/^\d+$/.test(anioPublicacionStr)) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El año de publicación debe contener solo dígitos.`);
      } else {
        const anioPublicacion = parseInt(anioPublicacionStr, 10);
        
        if (anioPublicacion > anioActual) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: El año de publicación ${anioPublicacion} no puede ser mayor al año actual (${anioActual}).`);
        }
        
        if (anioPublicacion < 1000) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: El año de publicación ${anioPublicacion} no es válido.`);
        }
      }
      
      // Validar categoría ID
      if (!categoriaIdStr) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El campo categoriaId es obligatorio.`);
      } else if (!/^\d+$/.test(categoriaIdStr)) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El ID de categoría debe ser un número.`);
      }
      
      // Validar existencias
      if (!existenciasStr) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El campo existencias es obligatorio.`);
      } else if (!/^\d+$/.test(existenciasStr)) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: Las existencias deben ser un número.`);
      } else {
        const existencias = parseInt(existenciasStr, 10);
        if (existencias < 0) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: Las existencias no pueden ser negativas.`);
        }
      }
    }
    
    // Avanzar al paso 2 de validación
    this.pasoActualCsv = 2;
  }

  cargarCSV(): void {
    if (!this.archivoSeleccionado || this.erroresValidacion.length > 0) {
      return;
    }
    
    this.pasoActualCsv = 3;
    this.procesandoCsv = true;
    
    this.libroService.cargarLibrosDesdeCSV(this.archivoSeleccionado).subscribe({
      next: (respuesta) => {
        this.procesandoCsv = false;
        this.resultadoCarga = respuesta;
        
        // Actualizar la lista de libros si hubo éxitos
        if (respuesta.exitosos > 0) {
          this.getLibros();
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

  resetearProcesoCarga(): void {
    this.pasoActualCsv = 1;
    this.archivoSeleccionado = null;
    this.resultadoCarga = null;
    this.erroresValidacion = [];
    this.contenidoArchivo = '';
    this.procesandoCsv = false;
    
    // Limpiar el campo de archivo
    const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  //Método auxiliar para obtener el nombre del autor por ID
  obtenerNombreAutor(idAutor: number): string {
    return this.autoresPorId.get(idAutor) || `ID: ${idAutor}`;
  }

  // Método para mostrar mensajes al usuario
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