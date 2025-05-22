/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { Deuda } from 'src/app/models/deuda';
import { DeudaService } from './service/deuda.service';

import { Usuario } from 'src/app/models/usuario';
import { Libro } from 'src/app/models/libro';
import { Prestamo } from 'src/app/models/prestamo';
import { UsuarioService } from 'src/app/demo/pages/usuario/service/usuario.service';
import { LibroService } from 'src/app/demo/pages/libro/service/libro.service';
import { PrestamoService } from 'src/app/demo/pages/prestamo/service/prestamo.service';

declare const bootstrap: any;

@Component({
  selector: 'app-deuda',
  standalone: true,
  imports: [NgxSpinnerModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './deuda.component.html',
  styleUrl: './deuda.component.scss'
})
export class DeudaComponent {
  msjSpinner: string = '';
  modalInstance: any;
  modoFormulario: string = '';
  titleModal: string = '';

  deudaSelected: Deuda;
  deudas: Deuda[] = [];
  usuarios: Usuario[] = [];
  libros: Libro[] = [];
  prestamos: Prestamo[] = [];

  form: FormGroup = new FormGroup({
    id_usuario: new FormControl('', [Validators.required]),
    id_libro: new FormControl('', [Validators.required]),
    id_prestamo: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required]),
    monto: new FormControl('', [Validators.required])
  });

  constructor(
    private readonly deudaService: DeudaService,
    private readonly spinner: NgxSpinnerService,
    private readonly formBuilder: FormBuilder,
    private readonly usuarioService: UsuarioService,
    private readonly libroService: LibroService,
    private readonly prestamoService: PrestamoService
  ) {
    this.getDeudas();
    this.getUsuarios();
    this.getLibros();
    this.getPrestamos();
    this.cargarFormulario();
  }

  getUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (error) => console.error(error)
    });
  }

  getLibros() {
    this.libroService.getLibros().subscribe({
      next: (data) => this.libros = data,
      error: (error) => console.error(error)
    });
  }

  getPrestamos() {
    this.prestamoService.getPrestamos().subscribe({
      next: (data) => this.prestamos = data,
      error: (error) => console.error(error)
    });
  }

  getDeudas() {
    this.deudaService.getDeudas().subscribe({
      next: (data) => this.deudas = data.deudas, 
      error: (error) => console.error(error)
    });
  }

  cargarFormulario() {
    this.form = this.formBuilder.group({
      id_usuario: ['', [Validators.required]],
      id_libro: ['', [Validators.required]],
      id_prestamo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      monto: [0, [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  crearModal(modoForm: string) {
    this.getDeudas();
    this.modoFormulario = modoForm;
    this.titleModal = modoForm == 'C' ? 'Registrar Deuda' : 'Editar Deuda';
    const modalElement = document.getElementById('crearModal');
    modalElement.blur();
    modalElement.setAttribute('aria-hidden', 'false');
    if (modalElement && !this.modalInstance) {
      this.modalInstance = new bootstrap.Modal(modalElement);
    }
    this.modalInstance.show();
  }

  abrirModoEdicion(deuda: Deuda) {
    this.crearModal('E');
    this.deudaSelected = deuda;
    this.form.patchValue(deuda);
  }

  cerrarModal() {
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    if (this.modalInstance) this.modalInstance.hide();
    this.deudaSelected = null;
  }

  guardarActualizar() {
    console.log('Guardar o actualizar deuda...');
    // Aquí puedes agregar lógica según modoFormulario ('C' o 'E')
  }
}
