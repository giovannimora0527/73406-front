/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
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
export class UsuarioComponent {
  usuarios: Usuario[] = [];
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";
  mensajeError: string = '';
  archivoSeleccionado: File | null = null;// para cargar archivos csv

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
    this.cargarListaUsuarios();
    this.cargarFormulario();
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
        Swal.fire('Error', error.error.message, 'error');
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
    }
  }

  
  // CREAR MASIVO DE USUARIOS 

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Verificar que sea un archivo CSV
      if (file.name.endsWith('.csv')) {
        this.archivoSeleccionado = file;
      } else {
        this.showMessage('Error', 'Solo se permiten archivos CSV', 'error');
        event.target.value = null; // Limpiar el input
      }
    }
  }

  // Nuevo método para cargar el archivo
cargarArchivo() {
  if (!this.archivoSeleccionado) {
    this.showMessage('Error', 'Debe seleccionar un archivo CSV', 'error');
    return;
  }

  this.spinner.show();
  this.msjSpinner = "Procesando archivo CSV...";

  this.usuarioService.cargarUsuariosDesdeCSV(this.archivoSeleccionado).subscribe({
    next: (respuesta) => {
      this.spinner.hide();
      
      const usuariosGuardados = respuesta.usuariosGuardados || 0;
      const errores = respuesta.errores || [];
      
      let mensaje = `Se han importado ${usuariosGuardados} usuarios correctamente.`;
      
      if (errores.length > 0) {
        mensaje += `\n\nSe encontraron ${errores.length} errores:`;
        
        // Mostrar hasta 5 errores para no sobrecargar el alert
        const erroresMostrados = errores.slice(0, 5);
        mensaje += erroresMostrados.map(error => `\n- ${error}`).join('');
        
        if (errores.length > 5) {
          mensaje += `\n...y ${errores.length - 5} errores más.`;
        }
      }
      
      this.showMessage(
        'Carga de usuarios', 
        mensaje, 
        errores.length > 0 ? 'warning' : 'success'
      );
      
      // Actualizar la lista de usuarios
      this.cargarListaUsuarios();
      
      // Limpiar el archivo seleccionado
      this.archivoSeleccionado = null;
      const fileInput = document.getElementById('csvFileInput') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Cerrar el modal
      const modalElement = document.getElementById('cargarCsvModal');
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    },
    error: (error) => {
    this.spinner.hide();

    let mensajeError = 'Error al procesar el archivo.';
    if (error.error.errores && Array.isArray(error.error.errores)) {
      mensajeError += '\n\n' + error.error.errores.map(e => `- ${e}`).join('\n');
    } else {
      mensajeError = (error.error.message || mensajeError).replace(/\. /g, '.\n');
    }

    this.showMessage('Error', mensajeError, 'error');
  }
  });
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