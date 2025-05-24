/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from './service/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
// Importa los objetos necesarios de Bootstrap
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  modalInstance: any;
  csvModalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";
  
  // Variables para carga CSV
  archivoSeleccionado: File = null;
  resultadoCarga: any = null;
  pasoActualCsv: number = 1;
  erroresValidacion: string[] = [];
  procesandoCsv: boolean = false;
  contenidoArchivo: string = '';

  usuarioSelected: Usuario;

  form: FormGroup = new FormGroup({
    nombre: new FormControl(''),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    activo: new FormControl('')
  });

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cargarFormulario();
  }

  ngOnInit(): void {
    this.cargarListaUsuarios();
    
    // Escuchar el evento hidden.bs.modal para restablecer el modal cuando se cierra con la X
    document.addEventListener('hidden.bs.modal', (event: any) => {
      if (event.target.id === 'cargarCsvModal') {
        this.resetearProcesoCarga();
      }
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      activo: [true, [Validators.required]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  cargarListaUsuarios() {
    this.spinner.show();
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        console.log(data);
        this.usuarios = data;
        this.spinner.hide();
      },
      error: (error) => {
        this.showMessage('Error', error.error?.message || 'Error al cargar usuarios', 'error');
        this.spinner.hide();
      }
    });
  }

  crearUsuarioModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Usuario' : 'Editar Usuario';
    const modalElement = document.getElementById('crearUsuarioModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement) {
      // Verificar si ya existe una instancia del modal
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
      correo: '',
      telefono: '',
      activo: ''
    });
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.usuarioSelected = null;
  }

  abrirModoEdicion(usuario: Usuario) {
    this.crearUsuarioModal('E');
    this.usuarioSelected = usuario;
    this.form.patchValue({
      nombre: this.usuarioSelected.nombre,
      correo: this.usuarioSelected.correo,
      telefono: this.usuarioSelected.telefono,
      activo: !!this.usuarioSelected.activo  // asegura que sea booleano
    });
  }

  guardarActualizarUsuario() {   
    console.log(this.form.valid);
    if (this.modoFormulario === 'C') {
      this.form.get('activo').setValue(true);
    }
    if (this.form.valid) {
      console.log('El formualario es valido');
      if (this.modoFormulario.includes('C')) {
        console.log('Creamos un usuario nuevo');
        this.usuarioService.guardarUsuario(this.form.getRawValue())
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
              this.cargarListaUsuarios();
              this.cerrarModal(); 
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
          }
        });
      } else {
        console.log('Actualizamos un usuario existente');
        // Actualizar solo los campos específicos
        const idUsuario = this.usuarioSelected.idUsuario;
        this.usuarioSelected = {
          ...this.usuarioSelected, // Mantener los valores anteriores
          ...this.form.getRawValue() // Sobrescribir con los valores del formulario
        };
        this.usuarioSelected.idUsuario = idUsuario;       
        console.log(this.usuarioSelected);    
        this.usuarioService.actualizarUsuario(this.usuarioSelected)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.showMessage("Éxito", data.message, "success");
              this.cargarListaUsuarios();
              this.cerrarModal();             
          },
          error: (error) => {
            console.log(error);
            this.showMessage("Error", error.error.message, "error");
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
        lineas[0].toLowerCase().includes('correo') || 
        lineas[0].toLowerCase().includes('telefono')) {
      inicioLineas = 1;
    }
    
    // Validamos todas las líneas para una verificación completa
    const lineasAValidar = lineas.slice(inicioLineas);
    
    // Recopilamos los nombres y correos para verificar duplicados en el mismo archivo
    const nombresEnArchivo = new Set<string>();
    const correosEnArchivo = new Set<string>();
    const nombresExistentes = this.usuarios.map(usuario => usuario.nombre.toLowerCase());
    const correosExistentes = this.usuarios.map(usuario => usuario.correo.toLowerCase());
    
    // Expresiones regulares para validación
    const nombrePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras y espacios
    const telefonoPattern = /^\d{1,15}$/; // Solo números, max 15 dígitos
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/; // Formato de correo
    
    for (let i = 0; i < lineasAValidar.length; i++) {
      const numeroLinea = inicioLineas + i + 1;
      const linea = lineasAValidar[i];
      
      // Validar campos requeridos
      const campos = linea.split(',');
      
      if (campos.length < 3) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: Faltan campos. Se requieren 3 campos (nombre, correo, telefono).`);
        continue;
      }
      
      const nombre = campos[0].trim().replace(/"/g, "");
      const correo = campos[1].trim().replace(/"/g, "");
      const telefono = campos[2].trim().replace(/"/g, "");
      
      // Validación del nombre
      if (!nombre) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El nombre es obligatorio.`);
      } else if (!nombrePattern.test(nombre)) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El nombre solo debe contener letras: "${nombre}".`);
      } else {
        // Verificar duplicados en el mismo archivo
        const nombreLower = nombre.toLowerCase();
        if (nombresEnArchivo.has(nombreLower)) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: El usuario con nombre "${nombre}" está duplicado en el archivo.`);
        } else {
          nombresEnArchivo.add(nombreLower);
        }
        
        // Verificar si el nombre ya existe en la base de datos
        if (nombresExistentes.includes(nombreLower)) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: El usuario con nombre "${nombre}" ya existe en la base de datos.`);
        }
      }
      
      // Validación del correo
      if (!correo) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El correo es obligatorio.`);
      } else if (!emailPattern.test(correo)) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El formato del correo es inválido: "${correo}".`);
      } else {
        // Verificar duplicados en el mismo archivo
        const correoLower = correo.toLowerCase();
        if (correosEnArchivo.has(correoLower)) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: El correo "${correo}" está duplicado en el archivo.`);
        } else {
          correosEnArchivo.add(correoLower);
        }
        
        // Verificar si el correo ya existe en la base de datos
        if (correosExistentes.includes(correoLower)) {
          this.erroresValidacion.push(`Línea ${numeroLinea}: El correo "${correo}" ya existe en la base de datos.`);
        }
      }
      
      // Validación del teléfono
      if (!telefono) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El teléfono es obligatorio.`);
      } else if (!telefonoPattern.test(telefono)) {
        this.erroresValidacion.push(`Línea ${numeroLinea}: El teléfono debe contener solo números y tener máximo 15 dígitos: "${telefono}".`);
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
    
    this.usuarioService.cargarUsuariosDesdeCSV(this.archivoSeleccionado).subscribe({
      next: (respuesta) => {
        this.procesandoCsv = false;
        
        // Transformar la respuesta al formato esperado
        this.resultadoCarga = {
          totalProcesados: (respuesta.usuariosGuardados || 0) + (respuesta.errores?.length || 0),
          exitosos: respuesta.usuariosGuardados || 0,
          fallidos: respuesta.errores?.length || 0,
          errores: respuesta.errores || []
        };
        
        // Actualizar la lista de usuarios si hubo éxitos
        if (respuesta.usuariosGuardados > 0) {
          this.cargarListaUsuarios();
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