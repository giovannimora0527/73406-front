import { Component } from '@angular/core';
import { AutorService } from './service/autor.service';
import { CommonModule } from '@angular/common';
import { Autor} from 'src/app/models/autor';
import Swal, {SweetAlertIcon} from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
declare const bootstrap: any;
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-autor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxSpinnerModule],
  templateUrl: './autor.component.html',
  styleUrl: './autor.component.scss'
})
export class AutorComponent {
    Autores: Autor[] = [];
    modalInstance: any;
    modoFormulario: string = '';
    titleModal: string = '';
    msjSpinner: string = "Cargando";

    AutorSelected: Autor;

    form: FormGroup = new FormGroup({
      nombre: new FormControl(''),
      correo: new FormControl(''),
      telefono: new FormControl(''),
      activo: new FormControl('')
    });
  

  constructor(
    private autorService: AutorService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.cargarListaAutores();
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
cargarListaAutores() {
  this.spinner.show();
  this.autorService.getAutor().subscribe({
    next: (data) => {
      console.log(data);
      this.Autores = data;
      //this.spinner.hide();
    },
    error: (error) => {
            Swal.fire('Error', error.error.message, 'error');
            this.spinner.hide();
          }
        });
      }
      crearAutorModal(modoForm: string) {
        this.modoFormulario = modoForm;
        this.titleModal = modoForm == 'C' ? 'Crear Autor' : 'Editar Autor';
        const modalElement = document.getElementById('crearAutorModal');
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
        this.AutorSelected = null;
      }
      abrirModoEdicion(Autor: Autor) {
          this.crearAutorModal('E');
          this.AutorSelected = Autor;
          this.form.patchValue({
            nombre: this.AutorSelected.nombre,
            correo: this.AutorSelected.correo,
            telefono: this.AutorSelected.telefono,
            activo: !!this.AutorSelected.activo  // asegura que sea booleano
          });
        }
        guardarActualizarAutor() {   
          console.log(this.form.valid);
          if (this.modoFormulario === 'C') {
            this.form.get('activo').setValue(true);
          }
          if (this.form.valid) {
            console.log('El formualario es valido');
            if (this.modoFormulario.includes('C')) {
              console.log('Creamos un Autor de autor nuevo');
              this.autorService.guardarAutor(this.form.getRawValue())
              .subscribe({
                next: (data) => {
                  console.log(data);
                  this.showMessage("Éxito", data.message, "success");
                    this.cargarListaAutores();
                    this.cerrarModal(); 
                },
                error: (error) => {
                  console.log(error);
                  this.showMessage("Error", error.error.message, "error");
                }
              });
            } else {
              console.log('Actualizamos un Autor de autor existente');
              // Actualizar solo los campos específicos
              const idAutor = this.AutorSelected.idAutor;
              this.AutorSelected = {
                ...this.AutorSelected, // Mantener los valores anteriores
                ...this.form.getRawValue() // Sobrescribir con los valores del formulario
              };
              this.AutorSelected.idAutor = idAutor;    
              console.log(this.AutorSelected);    
              this.autorService.actualizarAutor(this.AutorSelected)
              .subscribe({
                next: (data) => {
                  console.log(data);
                  this.showMessage("Éxito", data.message, "success");
                    this.cargarListaAutores();
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
              
