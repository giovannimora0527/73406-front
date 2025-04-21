import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { AutorService } from './service/autor.service';
import { Autor } from 'src/app/models/autor';
import { Nacionalidad } from 'src/app/models/nacionalidad';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule, NgIf, NgFor  ],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
  autores: Autor[] = [];
  nacionalidades: Nacionalidad[] = [];
  form: FormGroup;
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';
  msjSpinner: string = "Cargando";
  autorSelected: Autor | null = null;

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      nacionalidadId: [null, [Validators.required]]
    });
    this.cargarListaAutores();
    this.cargarNacionalidades();
  }

  cargarNacionalidades() {
    this.spinner.show();
    this.autorService.getNacionalidades().subscribe({
      next: (data) => {
        console.log(data);
        this.nacionalidades = data;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error al cargar nacionalidades:', error);
        this.spinner.hide();
        this.showMessage("Error", "No se pudieron cargar las nacionalidades", "error");
      }
    });
  }

  cargarListaAutores() {
    this.spinner.show();
    this.autorService.getAutores().subscribe({
      next: (data) => {
        this.autores = data;
        this.spinner.hide();
      },
      error: (error) => {
        this.spinner.hide();
        this.showMessage("Error", "No se pudieron cargar los autores", "error");
      }
    });
  }

  crearAutorModal(modoForm: string) {
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
    const modalElement = document.getElementById('crearAutorModal');
    if (modalElement) {
      if (!this.modalInstance) {
        this.modalInstance = new (window as any).bootstrap.Modal(modalElement);
      }
      this.modalInstance.show();
    }
    if (modoForm === 'C') {
      this.form.reset();
      this.autorSelected = null;
    }
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.autorSelected = null;
  }

  abrirModoEdicion(autor: Autor) {
    this.crearAutorModal('E');
    this.autorSelected = autor;
    this.form.patchValue({
      nombre: autor.nombre,
      fechaNacimiento: autor.fechaNacimiento,
      nacionalidadId: autor.nacionalidad?.nacionalidad_id
    });
  }

  guardarAutor() {
    this.form.markAllAsTouched();
  
    if (this.form.valid) {
      // Construir el objeto autorData usando los valores actuales del formulario
      const autorData: any = {
        nombre: this.form.get('nombre')?.value,
        fechaNacimiento: this.form.get('fechaNacimiento')?.value,
        nacionalidadId: this.form.get('nacionalidadId')?.value
      };
  
      if (this.modoFormulario === 'C') {
        // Crear nuevo autor
        this.autorService.guardarAutor(autorData).subscribe({
          next: (data) => {
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
            this.cerrarModal();
          },
          error: (error) => {
            this.showMessage("Error", error.error?.message || "Ocurrió un error al guardar el autor", "error");
          }
        });
      } else {
        // Actualizar autor existente
        const idAutor = this.autorSelected.idAutor;
        const autorEditado = {
          ...this.autorSelected,
          ...autorData,
          idAutor: idAutor // asegúrate de mantener el id
        };
        this.autorService.actualizarAutor(autorEditado).subscribe({
          next: (data) => {
            this.showMessage("Éxito", data.message, "success");
            this.cargarListaAutores();
            this.cerrarModal();
          },
          error: (error) => {
            this.showMessage("Error", error.error?.message || "Ocurrió un error al actualizar el autor", "error");
          }
        });
      }
    } else {
      this.showMessage("Atención", "Complete todos los campos", "warning");
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
        }
      });
    }
  
    // ¡Este es el ÚNICO método get f() que debe existir!
    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
  } // ← Solo este cierre de clase es necesario
  
